import subscribersRepository from "../db/repository/subscribersRepository";
import subscriptionsService from "./subscriptionsService";
import { subscriberDTO, UserType } from "../dto";
import HELPERS from "../utils/helpers";
import errorHandler, { ErrorEnum } from "../utils/error";
import Paystack from "../utils/paystack";
import { APP_BASE_URL } from "../utils/env";
import dayjs from "dayjs";

class SubscriberService {
  private logInfo = "";
  public async create(parent: string, user: UserType, books: string[] = []) {
    try {
      if (!parent || !user) {
        throw await errorHandler.CustomError(
          ErrorEnum[400],
          "Missing required fields"
        );
      }
      const parentSubscription = await subscriptionsService.fetchOne(parent);
      if (!parentSubscription) {
        throw await errorHandler.CustomError(
          ErrorEnum[404],
          "Entity not found"
        );
      }
      const subscription: subscriberDTO = {
        parent,
        active: false,
        books,
        ref: `temp(${HELPERS.genRandCode()})`,
        user: user._id as string,
      };
      const newSubscription = await subscribersRepository.create(subscription);
      const callback_url = `${APP_BASE_URL}/api/v1/subscribers/callback`;
      const paystackResponse = await Paystack.initializeTransaction(
        parentSubscription.amount,
        user.email,
        {
          customer: {
            id: user._id as string,
            name: user.username,
          },
          subscription: {
            id: newSubscription._id as string,
            duration: parentSubscription.duration,
          },
        },
        callback_url
      );
      await this.update(
        { ref: paystackResponse.data.reference },
        newSubscription._id as string
      );
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } creating subscription @ ${HELPERS.currentTime()}`;

      return paystackResponse;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } creating subscription @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  public async verifySubscription(ref: string): Promise<subscriberDTO> {
    const today = dayjs(new Date()).toISOString();
    try {
      if (!ref) {
        throw await errorHandler.CustomError(
          ErrorEnum[400],
          "Reference is required"
        );
      }
      HELPERS.LOG("here");
      const paystackResponse = await Paystack.verifyTransaction(ref);
      HELPERS.LOG("after paystack", { paystackResponse });
      const subscription = await subscribersRepository.fetchOne({ ref });
      if (!subscription) {
        throw await errorHandler.CustomError(
          ErrorEnum[404],
          "Subscription not found"
        );
      }
      if (subscription.active) {
        throw await errorHandler.CustomError(
          ErrorEnum[400],
          "Subscription already active"
        );
      }
      const updatedSubscription = await this.update(
        { active: true, activatedAt: today, updatedAt: today },
        subscription._id as string
      );
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } verifying subscription @ ${HELPERS.currentTime()}`;
      return updatedSubscription;
    } catch (error: any) {
      HELPERS.LOG("error", error);
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } verifying subscription @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  public async fetchOne(
    params: Partial<{ _id: string; ref: string }>
  ): Promise<subscriberDTO> {
    try {
      const fetchedSubscription = await subscribersRepository.fetchOne({
        ...params,
      });
      return fetchedSubscription ?? {};
    } catch (error: any) {
      throw error;
    }
  }

  public async update(
    subscription: Partial<subscriberDTO>,
    subscriptionID: string
  ): Promise<subscriberDTO> {
    try {
      const updatedSubscription = await subscribersRepository.update(
        { ...subscription },
        subscriptionID
      );
      return updatedSubscription;
    } catch (error: any) {
      throw error;
    }
  }

  public async validateSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const child = await this.fetchOne({ _id: subscriptionId });
      const parent = await subscriptionsService.fetchOne(child.parent);

      const duration = HELPERS.millisecondsToDays(parent.duration);

      const daysGone = HELPERS.countDaysBetweenDates(
        child?.createdAt as string,
        HELPERS.currentTime('DD/MM/YYYY') as string
      );

      return daysGone <= duration;
    } catch (error: any) {
      console.log({ error });
      throw error;
    }
  }
}

export default new SubscriberService();
