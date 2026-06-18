import { ErrorEnum } from "../utils/error";
import repo from "../db/repository/subscriptionRepository";
import { SubscriptionsType, SubscriptionsResponse } from "../dto";

import CustomError, { ErrorCodes } from "../utils/CustomError";
import { CacheService } from "./utils/cacheService";

class SubscriptionService {
  private logInfo = "";

  public async create(
    subscription: SubscriptionsType
  ): Promise<SubscriptionsType> {
  
      await this.checkPayload(subscription);
      const result = await repo.create(subscription);
      await CacheService.clearPattern("subscriptions:*");
      return result;
   
  }
  public async fetchOne(subscriptionId: string): Promise<SubscriptionsType> {
      const cacheKey = `subscriptions:one:id:${subscriptionId}`;
      const cached = await CacheService.get<SubscriptionsType>(cacheKey);
      if (cached) return cached;

      const fetchedSubscription = await repo.getOne(subscriptionId);
      const result = await this.reformatSubscription(fetchedSubscription);
      await CacheService.set(cacheKey, result, 3600);
      return result;
    
  }
  public async fetchAllSubscriptions(): Promise<SubscriptionsType[]> {
      const cacheKey = "subscriptions:all";
      const cached = await CacheService.get<SubscriptionsType[]>(cacheKey);
      if (cached) return cached;

      const fetchedSubscriptions = await repo.getList({
        visible: true,
        active: true,
      });
      const formatedSubscriptions = await Promise.all(
        fetchedSubscriptions.map((subscription) =>
          this.reformatSubscription(subscription)
        )
      );
      await CacheService.set(cacheKey, formatedSubscriptions, 3600);
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
      await CacheService.clearPattern("subscriptions:*");
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
    if (Number(subscription.duration) < 1){
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
    if (!subscription) return null as any;
    const formatedSubscription: SubscriptionsResponse = {
      id: subscription._id as string,
      name: subscription.name,
      active: subscription.active,
      visible: subscription.visible,
      duration: subscription.duration,
      users: subscription.users,
      autorenew: subscription.autorenew,
      amount: subscription.amount,
      books: subscription.books,
      origin: subscription.origin,
      accent: subscription.accent,
      createdAt: subscription.createdAt as string,
    };

    return formatedSubscription;
  }
}

export default new SubscriptionService();
