import Repo from "../db/repository/userRepository";
import subscribersService from "./subscribersService";
import type { UserResponse, UserType } from "../dto";
import { ErrorEnum } from "../utils/error";
import { APP_BASE_URL, STARTUP_SUBSCRIPTION } from "../utils/env";

import HELPERS from "../utils/helpers";
import bcrypt from "bcrypt";

import Session from "./sessionService";
import notificationService from "./notificationService";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import { sanitizeHtml } from "../utils/richText";

export class UserService {
  private logInfo: string | null = null;

  public async create(user: UserType): Promise<UserType> {
      if (!user.email || !user.username || !user.password) {
        throw new CustomError(ErrorEnum[400], "Invalid user data",ErrorCodes.BAD_REQUEST);
      }

      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(user.password, salt);
      const newUser = await Repo.create(user);
      const verificationCode = await this.generateVerification(
        newUser._id as string
      );
      const { subscription } = await subscribersService.create(
        STARTUP_SUBSCRIPTION,
        newUser
      );

      await this.updateUser(
        { subscription: subscription._id },
        newUser._id as string
      );

      await notificationService.notify({
        user: {
          email: newUser.email,
          whatsappNumber: newUser.whatsappNumber,
        },
        whatsapp: {
          text: `Hello ${newUser.username}, verify your Anansesemfie account: ${APP_BASE_URL}/callback/verify?verificationCode=${verificationCode}`,
        },
        email: {
          subject: "Verify Account",
          html: `Hello <b>${newUser.username}</b>, verify your account: ${APP_BASE_URL}/callback/verify?verificationCode=${verificationCode}`,
          template: {
            header: "New Account Verification",
            body: "Verify your account to start using our services",
            actions: [
              {
                link: `${APP_BASE_URL}/callback/verify?verificationCode=${verificationCode}`,
                title: "Verify Account",
              },
            ],
          },
        },
      });
      return newUser;
  }

  public async updateUser(
    payload: Partial<UserType>,
    userID: string
  ): Promise<UserType> {
      const updatedUser = (await Repo.update(payload, userID)) as UserType;
     
      return updatedUser;
    
  }

  public async login(user: { email: string; password: string }): Promise<any> {
    
      const fetchedUser = await Repo.Login(user?.email);
      if (!fetchedUser || !fetchedUser.active) {
        throw new CustomError(
          ErrorEnum[404],
          "User not found or inactive",
          ErrorCodes.NOT_FOUND
        );
      }
      const isPasswordValid = await bcrypt.compare(
        user?.password,
        fetchedUser.password
      );
      if (!isPasswordValid) {
        throw new CustomError(
          ErrorEnum[403],
          "Invalid user credentials",
          ErrorCodes.FORBIDDEN
        );
      }
      return await this.formatForReturn(fetchedUser);
   
  }

  public async logout(sessionId: string) {
      const session = await Session.endSession(sessionId);
   
  }
  public async fetchUser(userId: string): Promise<UserType | null> {
      const fetchedUser = await Repo.fetchUser(userId);
      return fetchedUser;
  }

  private async formatForReturn(user: UserType): Promise<any> {
      const token = await Session.create(user?._id as string, {
        duration: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        external: false,
      });
      return {
        email: user.email,
        username: user.username,
        dp: user.dp,
        bio: user.bio,
        token: await HELPERS.ENCODE_Token(token?._id),
        role: user.account,
        subscription: {
          active: !!user.subscription,
          id: user.subscription ? user.subscription.toString() : "",
        },
      };
  }

  public async resetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    const code = await HELPERS.DECODE_TOKEN(token);
    const user = await Repo.fetchOneByKey(code ?? "");
    if (!user) {
      throw new CustomError(
        ErrorEnum[404],
        "User not found or invalid token",
        ErrorCodes.NOT_FOUND
      );
    }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      await this.updateUser(
        { password: hashedPassword, active: true },
        user._id as string
      );
  }

  public async requestPasswordReset(email: string): Promise<void> {
      const user = await Repo.fetchOneByEmail(email);
      if (!user) {
        throw new CustomError(
          ErrorEnum[404],
          "User not found",
          ErrorCodes.NOT_FOUND
        );
      }
      const token = await this.generatePasswordResetToken(user);
      const encryptedToken = await HELPERS.ENCODE_Token(token);
      await notificationService.notify({
        user: {
          email: user.email,
          whatsappNumber: user.whatsappNumber,
        },
        whatsapp: {
          text: `Hello ${user.username}, reset your Anansesemfie password: ${APP_BASE_URL}/callback/resetPassword?token=${encryptedToken}&email=${user.email}`,
        },
        email: {
          subject: "Password Reset",
          html: `Hello ${user.username}, reset your password <a href="${APP_BASE_URL}/callback/resetPassword?token=${encryptedToken}&email=${user.email}">here</a>`,
          template: {
            header: "Password Reset",
            body: "Reset your password to regain access to your account.",
            actions: [
              {
                title: "Reset Password",
                link: `${APP_BASE_URL}/callback/resetPassword?token=${encryptedToken}&email=${user.email}`,
              },
            ],
          },
        },
      });
  
  }

  public async createSubscription(
    sessionId: string,
    subscriptionParentID: string
  ) {
      const session = await Session.getSession(sessionId);
      const curUser = (await Repo.fetchUser(
        session.user._id as string
      )) as UserType;

      //create child subscription
      const { paymentDetails, subscription } = await subscribersService.create(
        subscriptionParentID,
        curUser
      );
      if (!subscription) {
        throw new CustomError(
          ErrorEnum[500],
          "Failed to create subscription",
          ErrorCodes.INTERNAL_SERVER_ERROR
        );
      }
      this.updateUser(
        { subscription: subscription._id },
        curUser._id as string
      );

      return paymentDetails;
  }

  public async linkSubscription(sessionId: string, ref: string) {
      const { user } = await Session.getSession(sessionId);

      const subscription = await subscribersService.fetchOne({ ref });
      if (!subscription) {
        throw new CustomError(
          ErrorEnum[404],
          "Subscription not found",
          ErrorCodes.NOT_FOUND
        );
      }
      //create child subscription
      const payload = {
        subscription: subscription._id,
      };
      const newSubscription = await this.updateUser(
        payload,
        user._id as string
      );

      return newSubscription;
  }

  private async generatePasswordResetToken(user: UserType): Promise<string> {
    const token = HELPERS.genRandCode();
    await this.updateUser({ key: token }, user._id as string);
    return token;
  }

  private async generateVerification(userId: string) {

      const token = HELPERS.genRandCode();
      await Repo.update(
        {
          key: token,
        },
        userId
      );

      return HELPERS.ENCODE_Token(token);
   
  }

  public async verifyAccount(verificationCode: string) {
      if (!verificationCode){
        throw new CustomError(
          ErrorEnum[400],
          "Verification code is required",
          ErrorCodes.BAD_REQUEST
        );
      }
        
      const code = await HELPERS.DECODE_TOKEN(verificationCode);
      const user = await Repo.fetchOneByKey(code ?? "");
      if (!user) {
        throw new CustomError(
          ErrorEnum[404],
          "User not found or already verified",
          ErrorCodes.NOT_FOUND
        );
      }
      await this.updateUser({ active: true }, user._id as string);
     
      return user;
   
  }
  public async getProfile(sessionId: string): Promise<UserResponse> {
    const { user } = await Session.getSession(sessionId);
    const fullUser = await Repo.fetchUser(user._id as string);
    if (!fullUser) {
      throw new CustomError(ErrorEnum[404], "User not found", ErrorCodes.NOT_FOUND);
    }
    return this.formatUser(fullUser);
  }

  public async updateProfile(
    sessionId: string,
    payload: Pick<Partial<UserType>, "username" | "bio" | "dp" | "whatsappNumber">
  ): Promise<UserResponse> {
    const { user } = await Session.getSession(sessionId);

    // Only permit safe, user-editable fields
    const allowedFields: Partial<UserType> = {};
    if (payload.username !== undefined) allowedFields.username = payload.username;
    if (payload.bio !== undefined) allowedFields.bio = sanitizeHtml(payload.bio);
    if (payload.dp !== undefined) allowedFields.dp = payload.dp;
    if (payload.whatsappNumber !== undefined) allowedFields.whatsappNumber = payload.whatsappNumber;

    if (Object.keys(allowedFields).length === 0) {
      throw new CustomError(ErrorEnum[400], "No valid fields to update", ErrorCodes.BAD_REQUEST);
    }

    const updated = await this.updateUser(allowedFields, user._id as string);
    return this.formatUser(updated);
  }

  public async formatUser(user: UserType): Promise<UserResponse> {

      const formattedUser = {
        id: user._id as string,
        email: user.email,
        username: user.username,
        account: user.account,
        active: user.active,
        dp: user.dp,
        bio: user.bio,
        whatsappNumber: user.whatsappNumber ?? "",
        subscription: user.subscription as string,
        createdAt: user.createdAt as string,
      };
      return formattedUser;
  }
}

export default new UserService();
