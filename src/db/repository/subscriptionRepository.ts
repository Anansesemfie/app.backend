import { Subscription } from "../models";
import { SubscriptionsType } from "../../dto";

const excludedFields = "-__v";

class SubscriptionsRepository {
  public async create(
    subscription: SubscriptionsType
  ): Promise<SubscriptionsType> {
    
      return await Subscription.create(subscription);
   
  }
  public async getOne(subscriptionId: string): Promise<SubscriptionsType> {
    
      const subscription = await Subscription.findOne({
        _id: subscriptionId,
      });
      return subscription;
   
  }
  public async getList(params: {}): Promise<SubscriptionsType[]> {
    
      const subscriptions = await Subscription.find({ ...params });
      return subscriptions;
   
  }

  public async update( subscription: SubscriptionsType, subscriptionId: string): Promise<SubscriptionsType> {
    
      const updatedSubscription = await Subscription.findOneAndUpdate(
        { _id: subscriptionId },
        subscription,
        {
          new: true,
        }
      );
      return updatedSubscription;
   
  }
}

export default new SubscriptionsRepository();
