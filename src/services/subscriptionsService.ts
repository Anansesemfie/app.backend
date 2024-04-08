import { Subscription } from "../db/models";
import { subscriptionsDTO } from "../dto";

class SubscriptionService {
  private logInfo = "";
  public async create(
    subscription: subscriptionsDTO
  ): Promise<subscriptionsDTO> {
    try {
      return await Subscription.create(subscription);
    } catch (error: any) {
      throw new Error(error);
    }
  }
  public async fetchOne(subscriptionId: string): Promise<subscriptionsDTO> {
    try {
      const fetchedSubscription = await Subscription.findOne({
        _id: subscriptionId,
      });
      return fetchedSubscription;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  public async fetchAllSubscriptions(): Promise<subscriptionsDTO[]> {
    try {
      const fetchedSubscriptions = await Subscription.find({
        visible: true,
        active: true,
      });
      return fetchedSubscriptions;
    } catch (error: any) {
      throw new Error(error);
    }
  }
  public async update(
    subscription: subscriptionsDTO,
    subscriptionId: string
  ): Promise<subscriptionsDTO> {
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
      throw new Error(error);
    }
  }
}

export default new SubscriptionService();
