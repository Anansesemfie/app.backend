import { ErrorEnum } from "../utils/error";
import repo from "../db/repository/subscriptionRepository";
import { SubscriptionsType, SubscriptionsResponse } from "../dto";

import CustomError, { ErrorCodes } from "../utils/CustomError";

class SubscriptionService {
  private logInfo = "";

  public async create(
    subscription: SubscriptionsType
  ): Promise<SubscriptionsType> {
  
      await this.checkPayload(subscription);
      return await repo.create(subscription);
   
  }
  public async fetchOne(subscriptionId: string): Promise<SubscriptionsType> {
      const fetchedSubscription = await repo.getOne(subscriptionId);
      return this.reformatSubscription(fetchedSubscription);
    
  }
  public async fetchAllSubscriptions(): Promise<SubscriptionsType[]> {
      const fetchedSubscriptions = await repo.getList({
        visible: true,
        active: true,
      });
      const formatedSubscriptions = await Promise.all(
        fetchedSubscriptions.map((subscription) =>
          this.reformatSubscription(subscription)
        )
      );
      return formatedSubscriptions;
  
  }
  public async update(
    subscription: SubscriptionsType,
    subscriptionId: string
  ): Promise<SubscriptionsType> {
      if (!subscriptionId) {
        throw new CustomError(
          ErrorEnum[400],
          "Subscription ID is required",
          ErrorCodes.BAD_REQUEST
        );
      }
      await this.checkPayload(subscription);
      const updatedSubscription = await repo.update(
        subscription,
        subscriptionId
      );
      return updatedSubscription;
   
  }

  private async checkPayload(
    subscription: SubscriptionsType
  ): Promise<void> {
    if (!subscription.name || !subscription.amount) {
      throw new CustomError(
        ErrorEnum[400],
        "Subscription name and amount are required",
        ErrorCodes.BAD_REQUEST
      );
    }
    if (subscription.duration < 1){
      throw new CustomError(
        ErrorEnum[400],
        "Invalid subscription duration",
        ErrorCodes.BAD_REQUEST
      );
    }
    if (subscription.autorenew && typeof subscription.autorenew !== "boolean") {
      throw new CustomError(
        ErrorEnum[400],
        "Autorenew must be a boolean value",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  private async reformatSubscription(
    subscription: SubscriptionsType
  ): Promise<SubscriptionsResponse> {
    const formatedSubscription: SubscriptionsResponse = {
      id: subscription._id as string,
      name: subscription.name,
      active: subscription.active,
      visible: subscription.visible,
      duration: subscription.duration,
      users: subscription.users,
      autorenew: subscription.autorenew,
      amount: subscription.amount,
      origin: subscription.origin,
      accent: subscription.accent,
      createdAt: subscription.createdAt as string,
    };

    return formatedSubscription;
  }
}

export default new SubscriptionService();
