import { Subscription } from "../models";
import { subscriptionsDTO } from "../../dto";

class SubscriptionsRepository {
  public async create(
    subscription: subscriptionsDTO
  ): Promise<subscriptionsDTO> {
    try {
      return await Subscription.create(subscription);
    } catch (error: any) {
      throw error;
    }
  }
  public async getSubscription(
    subscriptionId: string
  ): Promise<subscriptionsDTO> {
    try {
      const subscription = await Subscription.findOne({
        _id: subscriptionId,
      });
      return subscription;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new SubscriptionsRepository();
