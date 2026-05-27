import { Subscriber, Subscription } from "../../db/models";
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

    const grouped: { _id: string; count: number }[] = await (Subscriber as any).aggregate([
      { $match: { active: true } },
      { $group: { _id: "$parent", count: { $sum: 1 } } },
    ]);

    const planIds = grouped.map((g) => g._id);
    const plans = await Subscription.find({ _id: { $in: planIds } }, "name amount duration");

    const byPlan = grouped.map((g) => {
      const plan = plans.find((p: any) => p._id.toString() === g._id?.toString());
      const amount = plan ? (plan as any).amount : 0;
      const duration = plan ? (plan as any).duration : 30;
      const monthlyRate = amount / (duration / 30);
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
}

export default new RevenueService();
