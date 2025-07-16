import subscribersRepository from "../db/repository/subscribersRepository";
import subscriptionsService from "./subscriptionsService";
import { subscriberDTO, UserType } from "../dto";
import HELPERS from "../utils/helpers";
import { ErrorEnum } from "../utils/error";
import Paystack, { PAYSTACK_INIT_RESPONSE } from "../utils/paystack";
import { APP_BASE_URL } from "../utils/env";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import dayjs from "dayjs";

class SubscriberService {
  private logInfo = "";
  public async create(parent: string, user: UserType, books: string[] = []) {

      if (!parent || !user) {
        throw new CustomError(
          ErrorEnum[400],
          "Parent subscription ID and user are required",
          ErrorCodes.BAD_REQUEST
        );
      }
      const parentSubscription = await subscriptionsService.fetchOne(parent);
      if (!parentSubscription) {
        throw new CustomError(
          ErrorEnum[404],
          "Parent subscription not found",
          ErrorCodes.NOT_FOUND
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
      if (!newSubscription) {
        throw new CustomError(
          ErrorEnum[500],
          "Failed to create subscription",
          ErrorCodes.INTERNAL_SERVER_ERROR
        );
      }
      const callback_url = `${APP_BASE_URL}/api/v1/subscribers/callback`;
      if (parentSubscription.amount === 0) {
        await this.update(
          { active: true, activatedAt: HELPERS.currentTime() as string },
          newSubscription._id as string
        );
        this.logInfo = `${
          HELPERS.loggerInfo.success
        } creating start up subscription @ ${HELPERS.currentTime()}`;
        return {
          paymentDetails: {} as PAYSTACK_INIT_RESPONSE,
          subscription: newSubscription,
        };
      } else {
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

        return {
          paymentDetails: paystackResponse,
          subscription: newSubscription,
        };
      }
   
  }

  public async verifySubscription(ref: string): Promise<subscriberDTO> {
    const today = dayjs(new Date()).toISOString();
      if (!ref) {
        throw new CustomError(
          ErrorEnum[400],
          "Reference is required for verification",
          ErrorCodes.BAD_REQUEST
        );
      }
       await Paystack.verifyTransaction(ref);
      const subscription = await subscribersRepository.fetchOne({ ref });
      if (!subscription) {
       throw new CustomError(
          ErrorEnum[404],
          "Subscription not found",
          ErrorCodes.NOT_FOUND
        );
      }
      if (subscription.active) {
       throw new CustomError(
          ErrorEnum[400],
          "Subscription is already active",
          ErrorCodes.BAD_REQUEST
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
   
  }

  public async fetchOne(
    params: Partial<{ _id: string; ref: string }>
  ): Promise<subscriberDTO> {
      const fetchedSubscription = await subscribersRepository.fetchOne({
        ...params,
      });
      if (!fetchedSubscription){
        throw new CustomError(
          ErrorEnum[404],
          "Subscription not found",
          ErrorCodes.NOT_FOUND
        );
      }
       
      return fetchedSubscription ?? {};
  }

  public async update(
    subscription: Partial<subscriberDTO>,
    subscriptionID: string
  ): Promise<subscriberDTO> {
      const updatedSubscription = await subscribersRepository.update(
        { ...subscription },
        subscriptionID
      );
      return updatedSubscription;
  
  }

  public async validateSubscription(subscriptionId: string): Promise<boolean> {

      const child = await this.fetchOne({ _id: String(subscriptionId) });
      const parent = await subscriptionsService.fetchOne(child.parent);

      const duration = HELPERS.millisecondsToDays(parent.duration);

      const daysGone = HELPERS.countDaysBetweenDates(
        child?.createdAt as string,
        HELPERS.currentTime() as string
      );
      

      return daysGone <= duration;
   
  }
}

export default new SubscriberService();
