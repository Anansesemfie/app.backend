import { Subscription } from "../models";
import { SubscriptionsType } from "../../dto";

const excludedFields = "-__v";

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
  public async getOne(subscriptionId: string): Promise<SubscriptionsType> {
    try {
      const subscription = await Subscription.findOne({
        _id: subscriptionId,
      });
      return subscription;
    } catch (error: any) {
      throw error;
    }
  }
  public async getList(params: {}): Promise<SubscriptionsType[]> {
    try {
      const subscriptions = await Subscription.find({ ...params });
      return subscriptions;
    } catch (error: any) {
      throw error;
    }
  }

  public async update( subscription: SubscriptionsType, subscriptionId: string): Promise<SubscriptionsType> {
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

export default new SubscriptionsRepository();
