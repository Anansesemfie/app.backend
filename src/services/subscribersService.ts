import subscribersRepository from "../db/repository/subscribersRepository";
import subscriptionsService from "./subscriptionsService";
import { subscriberDTO } from "../dto";
import HELPERS from "../utils/helpers";

class SubscriberService {
  private logInfo = "";
  public async create(subscription: subscriberDTO): Promise<subscriberDTO> {
    try {
      return await subscribersRepository.create(subscription);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async fetchOne(subscriptionID: string): Promise<subscriberDTO> {
    try {
      const fetchedSubscription = await subscribersRepository.fetchOne(
        subscriptionID
      );
      return fetchedSubscription;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async update(
    subscription: subscriberDTO,
    subscriptionID: string
  ): Promise<subscriberDTO> {
    try {
      const updatedSubscription = await subscribersRepository.update(
        subscription,
        subscriptionID
      );
      return updatedSubscription;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async validateSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const child = await this.fetchOne(subscriptionId);
      const parent = await subscriptionsService.fetchOne(child.parent);

      const duration = HELPERS.millisecondsToDays(parent.duration);

      const daysGone = HELPERS.countDaysBetweenDates(
        child?.createdAt as string,
        HELPERS.currentTime()
      );

      return daysGone <= duration;
    } catch (error: any) {
      console.log({ error });
      throw new Error(error);
    }
  }
}

export default new SubscriberService();
