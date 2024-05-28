import { Subscription } from "../models";
import { SubscriptionsType } from "../../dto";

class SubscriptionsRepository {
  public async create(
    subscription: SubscriptionsType
  ): Promise<SubscriptionsType> {
    try {
      return await Subscription.create(subscription);
    } catch (error: any) {
      throw error;
    }
  }
  public async getSubscription(
    subscriptionId: string
  ): Promise<SubscriptionsType> {
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
