import repo from "../db/repository/subscriptionRepository";
import { SubscriptionsType, SubscriptionsResponse } from "../dto";

class SubscriptionService {
  private logInfo = "";

  public async create(
    subscription: SubscriptionsType
  ): Promise<SubscriptionsType> {
    try {
      return await repo.create(subscription);
    } catch (error: any) {
      throw error;
    }
  }
  public async fetchOne(subscriptionId: string): Promise<SubscriptionsType> {
    try {
      const fetchedSubscription = await repo.getOne(subscriptionId);
      return this.reformatSubscription(fetchedSubscription);
    } catch (error: any) {
      throw error;
    }
  }
  public async fetchAllSubscriptions(): Promise<SubscriptionsType[]> {
    try {
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
    } catch (error: any) {
      throw error;
    }
  }
  public async update(
    subscription: SubscriptionsType,
    subscriptionId: string
  ): Promise<SubscriptionsType> {
    try {
      const updatedSubscription = await repo.update(
        subscription,
        subscriptionId
      );
      return updatedSubscription;
    } catch (error: any) {
      throw error;
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
