import { Book, Subscriber, User, Seen } from "../../db/models";
import sessionService from "../sessionService";
import CustomError, { ErrorCodes } from "../../utils/CustomError";
import { ErrorEnum } from "../../utils/error";
import { UsersTypes } from "../../db/models/utils";

class DashboardService {
  private async assertAdmin(token: string) {
    const { user } = await sessionService.getSession(token);
    if (!user || user.account !== UsersTypes.admin) {
      throw new CustomError(ErrorEnum[403], "Forbidden", ErrorCodes.FORBIDDEN);
    }
  }

  async getStats(token: string): Promise<{ users: number; books: number; activeSubscribers: number }> {
    await this.assertAdmin(token);
    const [users, books, activeSubscribers] = await Promise.all([
      User.countDocuments(),
      Book.countDocuments(),
      Subscriber.countDocuments({ active: true }),
    ]);
    return { users, books, activeSubscribers };
  }

  async getPulse(token: string, days: number): Promise<{ date: string; plays: number }[]> {
    await this.assertAdmin(token);

    const clampedDays = Math.min(Math.max(days, 1), 90);
    const since = new Date();
    since.setDate(since.getDate() - clampedDays);

    const raw: { _id: string; plays: number }[] = await (Seen as any).aggregate([
      { $match: { playedAt: { $exists: true, $not: { $size: 0 } } } },
      { $unwind: "$playedAt" },
      { $match: { playedAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$playedAt" } },
          plays: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const map = new Map(raw.map((r) => [r._id, r.plays]));
    const result: { date: string; plays: number }[] = [];
    for (let i = clampedDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      result.push({ date: key, plays: map.get(key) ?? 0 });
    }
    return result;
  }
}

export default new DashboardService();
