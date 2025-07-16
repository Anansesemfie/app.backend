import { Subscriber } from "../models";
import { subscriberDTO } from "../../dto";

class SubscriberRepository {
  public async create(subscription: subscriberDTO): Promise<subscriberDTO> {
    return await Subscriber.create(subscription);
  }

  public async fetchOne(
    params: Partial<{ _id: string; ref: string }>
  ): Promise<subscriberDTO> {
    const fetchedSubscription = await Subscriber.findOne({
      ...params,
    });
    return fetchedSubscription;
  }

  public async update(
    subscription: Partial<subscriberDTO>,
    subscriptionID: string
  ): Promise<subscriberDTO> {
    const updatedSubscription = await Subscriber.findOneAndUpdate(
      { _id: subscriptionID },
      subscription,
      {
        new: true,
      }
    );
    return updatedSubscription;
  }
}

export default new SubscriberRepository();
