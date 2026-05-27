import { Subscriber, Subscription } from "../../db/models";
import sessionService from "../sessionService";
import CustomError, { ErrorCodes } from "../../utils/CustomError";
import { ErrorEnum } from "../../utils/error";
import { UsersTypes } from "../../db/models/utils";
import type { AdminSubscriberRecord, SubscriptionsType } from "../../dto";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatSubscriberRecord(s: any, plan: any): AdminSubscriberRecord {
  const activatedAt = s.activatedAt ? new Date(s.activatedAt) : null;
  const expiresAt =
    activatedAt && plan?.duration
      ? new Date(activatedAt.getTime() + (plan.duration as number))
      : null;
  const daysRemaining = expiresAt
    ? Math.ceil((expiresAt.getTime() - Date.now()) / 86_400_000)
    : null;

  return {
    id: String(s._id),
    user: {
      username: s.user?.username ?? "—",
      email: s.user?.email ?? "—",
      dp: s.user?.dp ?? "",
    },
    plan: plan?.name ?? "—",
    autorenew: plan?.autorenew ?? false,
    activatedAt,
    expiresAt,
    daysRemaining,
  };
}

class AdminSubscriptionsService {
  private async assertAdmin(token: string) {
    const { user } = await sessionService.getSession(token);
    if (!user || user.account !== UsersTypes.admin) {
      throw new CustomError(ErrorEnum[403], "Forbidden", ErrorCodes.FORBIDDEN);
    }
  }

  async getStats(token: string) {
    await this.assertAdmin(token);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Mongoose model registered without typed schema
    const Sub = Subscriber as any;

    const [active, grouped, recent] = await Promise.all([
      Subscriber.countDocuments({ active: true }),
      Sub.aggregate([
        { $match: { active: true } },
        { $group: { _id: "$parent", count: { $sum: 1 } } },
      ]) as Promise<{ _id: string; count: number }[]>,
      Sub.find({ active: true })
        .sort({ activatedAt: -1 })
        .limit(20)
        .populate({ path: "user", select: "username email dp", model: "users" })
        .populate({ path: "parent", select: "name duration autorenew", model: "subscription" }),
    ]);

    const planIds = (grouped as { _id: string; count: number }[]).map((g) => g._id);
    const plans = await Subscription.find({ _id: { $in: planIds } }, "name amount duration");

    const byPlan = (grouped as { _id: string; count: number }[]).map((g) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- untyped Mongoose document fields
      const plan = plans.find((p: any) => p._id.toString() === g._id?.toString());
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name: plan ? (plan as any).name : "Unknown",
        count: g.count,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        amount: plan ? (plan as any).amount : 0,
      };
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- populated Mongoose docs are untyped
    const recentFormatted: AdminSubscriberRecord[] = (recent as any[]).map((s: any) =>
      formatSubscriberRecord(s, s.parent)
    );

    return { active, byPlan, recent: recentFormatted };
  }

  async list(token: string) {
    await this.assertAdmin(token);
    const subscriptions = await Subscription.find({}).select("-__v").lean();
    return subscriptions;
  }

  async create(token: string, data: SubscriptionsType) {
    await this.assertAdmin(token);
    if (!data.name || !data.amount || !data.origin) {
      throw new CustomError(
        ErrorEnum[400],
        "Subscription name, amount, and origin are required",
        ErrorCodes.BAD_REQUEST
      );
    }
    if (!data.duration || data.duration < 1) {
      throw new CustomError(
        ErrorEnum[400],
        "Invalid subscription duration",
        ErrorCodes.BAD_REQUEST
      );
    }
    return await Subscription.create(data);
  }

  async update(token: string, id: string, data: Partial<SubscriptionsType>) {
    await this.assertAdmin(token);
    if (!id) {
      throw new CustomError(ErrorEnum[400], "Subscription ID is required", ErrorCodes.BAD_REQUEST);
    }
    const subscription = await Subscription.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();
    if (!subscription) {
      throw new CustomError(ErrorEnum[404], "Subscription not found", ErrorCodes.NOT_FOUND);
    }
    return subscription;
  }
}

export default new AdminSubscriptionsService();
