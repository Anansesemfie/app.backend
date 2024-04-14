import { Subscriber } from "../models";
import { subscriberDTO } from "../../dto";

class SubscriberRepository {
  public async create(subscription: subscriberDTO): Promise<subscriberDTO> {
    try {
      return await Subscriber.create(subscription);
    } catch (error: any) {
      throw error;
    }
  }

  public async fetchOne(subscriptionID: string): Promise<subscriberDTO> {
    try {
      const fetchedSubscription = await Subscriber.findOne({
        _id: subscriptionID,
      });
      return fetchedSubscription;
    } catch (error: any) {
      throw error;
    }
  }

  public async update(
    subscription: subscriberDTO,
    subscriptionID: string
  ): Promise<subscriberDTO> {
    try {
      const updatedSubscription = await Subscriber.findOneAndUpdate(
        { _id: subscriptionID },
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

export default new SubscriberRepository();
