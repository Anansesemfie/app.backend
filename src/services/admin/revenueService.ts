import dayjs from "dayjs";
import { Book, Subscriber, Subscription } from "../../db/models";
import sessionService from "../sessionService";
import CustomError, { ErrorCodes } from "../../utils/CustomError";
import { ErrorEnum } from "../../utils/error";
import { UsersTypes } from "../../db/models/utils";

class RevenueService {
  private async assertAdmin(token: string) {
    const { user } = await sessionService.getSession(token);
    if (!user || user.account !== UsersTypes.admin) {
      throw new CustomError(ErrorEnum[403], "Forbidden", ErrorCodes.FORBIDDEN);
    }
  }

  async getSummary(token: string) {
    await this.assertAdmin(token);

    const grouped: { _id: string; count: number }[] = await (
      Subscriber as any
    ).aggregate([
      { $match: { active: true } },
      { $group: { _id: "$parent", count: { $sum: 1 } } },
    ]);

    const planIds = grouped.map((g) => g._id);
    const plans = await Subscription.find(
      { _id: { $in: planIds } },
      "name amount duration"
    );

    const byPlan = grouped.map((g) => {
      const plan = plans.find(
        (p: any) => p._id.toString() === g._id?.toString()
      );
      const amount = plan ? (plan as any).amount : 0;
      const durationMs = plan ? (plan as any).duration : 2592000000;
      const months = durationMs / 2592000000;
      const monthlyRate = amount / months;
      const contribution = Math.round(monthlyRate * g.count);
      return {
        name: plan ? (plan as any).name : "Unknown",
        amount,
        count: g.count,
        contribution,
      };
    });

    const mrr = byPlan.reduce((sum, p) => sum + p.contribution, 0);
    const totalActiveSubscribers = byPlan.reduce((sum, p) => sum + p.count, 0);

    return { mrr, totalActiveSubscribers, byPlan };
  }

  async getBookRevenue(bookId: string, token: string) {
    const { user } = await sessionService.getSession(token);
    const isAdmin = user.account === UsersTypes.admin;

    if (!isAdmin) {
      if (!user.organization) {
        throw new CustomError(
          ErrorEnum[403],
          "Forbidden",
          ErrorCodes.FORBIDDEN
        );
      }
      const book = await Book.findById(bookId, "organization");
      if (
        !book ||
        String((book as any).organization) !== String(user.organization)
      ) {
        throw new CustomError(
          ErrorEnum[403],
          "Forbidden",
          ErrorCodes.FORBIDDEN
        );
      }
    }

    // Active subscribers whose subscription includes this book
    const subscribers = await (Subscriber as any)
      .find({ active: true, books: bookId })
      .populate("parent", "amount duration name");

    let totalRevenue = 0;
    const totalSubscribers: number = subscribers.length;

    for (const sub of subscribers) {
      const plan = sub.parent as any;
      if (plan && plan.amount) {
        totalRevenue += plan.amount;
      }
    }

    if (!isAdmin) {
      return { totalRevenue, totalSubscribers };
    }

    // Admin: full breakdown grouped by activatedAt year-month
    const periodMap: Record<
      string,
      { period: string; subscribers: number; revenue: number }
    > = {};

    for (const sub of subscribers) {
      const plan = sub.parent as any;
      const activatedAt = sub.activatedAt as Date | undefined;
      const periodKey = activatedAt
        ? dayjs(activatedAt).format("YYYY-MM")
        : "unknown";

      if (!periodMap[periodKey]) {
        periodMap[periodKey] = {
          period: periodKey,
          subscribers: 0,
          revenue: 0,
        };
      }
      periodMap[periodKey].subscribers++;
      if (plan && plan.amount) {
        periodMap[periodKey].revenue += plan.amount;
      }
    }

    const byPeriod = Object.values(periodMap).sort((a, b) =>
      a.period.localeCompare(b.period)
    );

    return { totalRevenue, totalSubscribers, byPeriod };
  }
}

export default new RevenueService();
