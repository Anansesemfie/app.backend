import { Subscription } from "../db/models";
import { SubscriptionsType } from "../dto";

class SubscriptionService {
  private logInfo = "";
  public async create(
    subscription: SubscriptionsType
  ): Promise<SubscriptionsType> {
    try {
      return await Subscription.create(subscription);
    } catch (error: any) {
      throw error;
    }
  }
  public async fetchOne(subscriptionId: string): Promise<SubscriptionsType> {
    try {
      const fetchedSubscription = await Subscription.findOne({
        _id: subscriptionId,
      });
      return fetchedSubscription;
    } catch (error: any) {
      throw error;
    }
  }
  public async fetchAllSubscriptions(): Promise<SubscriptionsType[]> {
    try {
      const fetchedSubscriptions = await Subscription.find({
        visible: true,
        active: true,
      });
      return fetchedSubscriptions;
    } catch (error: any) {
      throw error;
    }
  }
  public async update(
    subscription: SubscriptionsType,
    subscriptionId: string
  ): Promise<SubscriptionsType> {
    try {
      const updatedSubscription = await Subscription.findOneAndUpdate(
        { _id: subscriptionId },
        subscription,
        {
          new: true,
        }
      );
      return updatedSubscription;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new SubscriptionService();
