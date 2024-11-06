import Repo from "../db/repository/userRepository";
import subscribersService from "./subscribersService";
import { UserType } from "../dto";
import errorHandler, { ErrorEnum } from "../utils/error";
import { APP_BASE_URL } from "../utils/env";

import HELPERS from "../utils/helpers";
import bcrypt, { genSalt } from "bcrypt";

import Session from "./sessionService";
import EmailService from "./emailService";

export class UserService {
  private logInfo: string | null = null;

  public async create(user: UserType): Promise<UserType> {
    try {
      if (!user.email || !user.username || !user.password)
        throw await errorHandler.CustomError(
          ErrorEnum[400],
          "Invalid user data"
        );
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(user.password, salt);
      const newUser = await Repo.create(user);
      const verificationCode = await this.generateVerification(
        newUser._id as string
      );
      const HTML = `Hello <b>${newUser.username}</b>, <br/>verify your account <br/>
      <b>code:${verificationCode}</b> <br/>
      and <a href="${APP_BASE_URL}">goto app </a> or
      `;
      await EmailService.sendEmail(
        {
          to: newUser.email,
          subject: "Verify Account",
          html: HTML,
        },
        {
          link: `${APP_BASE_URL}?verificationCode=${verificationCode}`,
          label: "Verify Account",
        }
      );
      return newUser;
    } catch (error: any) {
      this.logInfo = `${HELPERS.loggerInfo.error} creating ${
        user.username
      } @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo as string);
      this.logInfo = null;
    }
  }

  public async login(user: { email: string; password: string }): Promise<any> {
    try {
      const fetchedUser = await Repo.Login(user?.email);
      this.logInfo = `${HELPERS.loggerInfo.success} logging in ${
        user.email
      } @ ${HELPERS.currentTime()}`;
      const isPasswordValid = await bcrypt.compare(
        user?.password,
        fetchedUser.password
      );
      if (!isPasswordValid) {
        throw await errorHandler.CustomError(
          ErrorEnum[403],
          "Invalid user credentials"
        );
      }
      return await this.formatForReturn(fetchedUser);
    } catch (error: any) {
      HELPERS.LOG({ error });
      this.logInfo = `${HELPERS.loggerInfo.error} logging in ${
        user.email
      } @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo as string);
      this.logInfo = null;
    }
  }

  public async logout(sessionId: string): Promise<string> {
    try {
      const session = await Session.endSession(sessionId);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } ended session: ${sessionId} @ ${HELPERS.currentTime()}`;
      return session;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } ended session: ${sessionId} @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo as string);
      this.logInfo = "";
    }
  }
  public async fetchUser(userId: string): Promise<UserType | null> {
    try {
      const fetchedUser = await Repo.fetchUser(userId);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } fetching user ${userId} @ ${HELPERS.currentTime()}`;
      return fetchedUser;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } fetching user ${userId} @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo as string);
      this.logInfo = "";
    }
  }

  private async formatForReturn(user: UserType): Promise<any> {
    try {
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
    } catch (error: any) {
      throw error;
    }
  }

  public async resetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    try {
      const userId = await Session.validateResetToken(token);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updated = await Repo.update({ password: hashedPassword }, userId);
      if (updated) {
        await EmailService.sendEmail(
          {
            to: updated.email,
            subject: "Password Reset",
            html: `Hello ${updated.username}, your password has been reset successfully.`,
          },
          { link: `${APP_BASE_URL}/app`, label: "Login" }
        );
      }
    } catch (error: any) {
      throw error;
    }
  }

  public async requestPasswordReset(email: string): Promise<void> {
    try {
      const user = await Repo.fetchOneByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }
      const token = await this.generatePasswordResetToken(user.email);
      await this.sendPasswordResetEmail(user.email, token);
    } catch (error: any) {
      throw error;
    }
  }

  public async createSubscription(
    sessionId: string,
    subscriptionParentID: string
  ) {
    try {
      const session = await Session.getSession(sessionId);
      if (!session) {
        throw await errorHandler.CustomError(
          ErrorEnum[403],
          "Invalid Session ID"
        );
      }
      const user = await Repo.fetchUser(session.user._id as string);
      if (!user) {
        throw await errorHandler.CustomError(ErrorEnum[404], "User not found");
      }
      //create child subscription
      const newSubscription = await subscribersService.create(
        subscriptionParentID,
        user
      );

      this.logInfo = `
      ${HELPERS.loggerInfo.success} creating subscription for user ${
        user.username
      } @ ${HELPERS.currentTime()}
      `;

      return newSubscription;
    } catch (error: any) {
      this.logInfo = `
      ${
        HELPERS.loggerInfo.error
      } creating subscription for user with session ID ${sessionId} @ ${HELPERS.currentTime()}
      `;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo as string);
      this.logInfo = null;
    }
  }

  public async linkSubscription(sessionId: string, ref: string) {
    try {
      const { user } = await Session.getSession(sessionId);

      const subscription = await subscribersService.fetchOne({ ref });
      //create child subscription
      const payload = {
        subscription: subscription._id,
      };
      const newSubscription = await Repo.update(payload, user._id as string);

      this.logInfo = `
      ${HELPERS.loggerInfo.success} linking subscription for user ${
        user.username
      } @ ${HELPERS.currentTime()}
      `;

      return newSubscription;
    } catch (error: any) {
      this.logInfo = `
      ${
        HELPERS.loggerInfo.error
      } linking subscription for user with session ID ${sessionId} @ ${HELPERS.currentTime()}
      `;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo as string);
      this.logInfo = null;
    }
  }

  private async generatePasswordResetToken(email: string): Promise<string> {
    // Generate a unique token (you can use libraries like crypto or uuid)
    const token = HELPERS.genRandCode();
    // await storeTokenInDatabase(email, token);
    return token;
  }

  private async sendPasswordResetEmail(
    email: string,
    token: string
  ): Promise<void> {
    // Send an email to the user containing a link with the password reset token embedded
    // await sendEmail(email, `Password Reset Link: https://anansesemfie.com/reset-password?token=${token}`);
  }

  private async generateVerification(userId: string) {
    try {
      const token = HELPERS.genRandCode();
      await Repo.update(
        {
          key: token,
        },
        userId
      );
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } creating verification code for useerId: ${userId} @ ${HELPERS.currentTime()}`;

      return HELPERS.ENCODE_Token(token);
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } creating verification code for user ${userId} @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo as string);
      this.logInfo = "";
    }
  }
}

export default new UserService();
