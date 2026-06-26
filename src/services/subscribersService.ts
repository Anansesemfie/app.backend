import subscribersRepository from "../db/repository/subscribersRepository";
import subscriptionsService from "./subscriptionsService";
import { subscriberDTO, UserType } from "../dto";
import HELPERS from "../utils/helpers";
import { ErrorEnum } from "../utils/error";
import Paystack, { PAYSTACK_INIT_RESPONSE } from "../utils/paystack";
import { APP_BASE_URL } from "../utils/env";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import dayjs from "dayjs";
import { CacheService } from "./utils/cacheService";

class SubscriberService {
  private logInfo = "";
  public async create(parent: string, user: UserType, books: string[] = []) {
    if (!parent || !user) {
      throw new CustomError(
        ErrorEnum[400],
        "Parent subscription ID and user are required",
        ErrorCodes.BAD_REQUEST,
      );
    }
    const parentSubscription = await subscriptionsService.fetchOne(parent);
    if (!parentSubscription) {
      throw new CustomError(
        ErrorEnum[404],
        "Parent subscription not found",
        ErrorCodes.NOT_FOUND,
      );
    }
    const subscription: subscriberDTO = {
      parent,
      active: false,
      books: books.length > 0 ? books : parentSubscription.books || [],
      ref: `temp(${HELPERS.genRandCode()})`,
      user: user._id as string,
    };
    const newSubscription = await subscribersRepository.create(subscription);
    if (!newSubscription) {
      throw new CustomError(
        ErrorEnum[500],
        "Failed to create subscription",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      );
    }
    await CacheService.clearPattern("subscribers:*");
    // const callback_url = `${APP_BASE_URL}/api/v1/subscribers/callback`;
    if (parentSubscription.amount === 0) {
      await this.update(
        { active: true, activatedAt: HELPERS.currentTime() as string },
        newSubscription._id as string,
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
      );
      await this.update(
        { ref: paystackResponse.data.reference },
        newSubscription._id as string,
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
        ErrorCodes.BAD_REQUEST,
      );
    }
    await Paystack.verifyTransaction(ref);
    const subscription = await subscribersRepository.fetchOne({ ref });
    if (!subscription) {
      throw new CustomError(
        ErrorEnum[404],
        "Subscription not found",
        ErrorCodes.NOT_FOUND,
      );
    }
    if (subscription.active) {
      throw new CustomError(
        ErrorEnum[400],
        "Subscription is already active",
        ErrorCodes.BAD_REQUEST,
      );
    }
    const updatedSubscription = await this.update(
      { active: true, activatedAt: today, updatedAt: today },
      subscription._id as string,
    );
    await CacheService.clearPattern("subscribers:*");
    this.logInfo = `${
      HELPERS.loggerInfo.success
    } verifying subscription @ ${HELPERS.currentTime()}`;
    return updatedSubscription;
  }

  public async fetchOne(
    params: Partial<{ _id: string; ref: string }>,
  ): Promise<subscriberDTO> {
    const cacheKey = `subscribers:one:p:${JSON.stringify(params)}`;
    const cached = await CacheService.get<subscriberDTO>(cacheKey);
    if (cached) return cached;

    const fetchedSubscription = await subscribersRepository.fetchOne({
      ...params,
    });
    if (!fetchedSubscription) {
      throw new CustomError(
        ErrorEnum[404],
        "Subscription not found",
        ErrorCodes.NOT_FOUND,
      );
    }

    await CacheService.set(cacheKey, fetchedSubscription, 3600);
    return fetchedSubscription ?? {};
  }

  public async update(
    subscription: Partial<subscriberDTO>,
    subscriptionID: string,
  ): Promise<subscriberDTO> {
    const updatedSubscription = await subscribersRepository.update(
      { ...subscription },
      subscriptionID,
    );
    await CacheService.clearPattern("subscribers:*");
    return updatedSubscription;
  }

  public async validateSubscription(
    subscriptionId: string,
  ): Promise<{ valid: boolean; books: string[] }> {
    const child = await this.fetchOne({ _id: String(subscriptionId) });

    // An unactivated subscription is never valid regardless of duration
    if (!child.activatedAt) return { valid: false, books: [] };

    const parent = await subscriptionsService.fetchOne(child.parent);

    const durationMs = HELPERS.getDurationMs(parent.duration);
    const expirationDate = dayjs(child.activatedAt).add(
      durationMs,
      "millisecond",
    );
    const isValid = dayjs().isBefore(expirationDate);

    return { valid: isValid, books: parent.books || [] };
  }
}

export default new SubscriberService();
