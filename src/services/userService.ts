import Repo from "../db/repository/userRepository";
import { UserType } from "../dto";
import errorHandler, { ErrorEnum } from "../utils/error";
import HELPERS from "../utils/helpers";
import bcrypt, { genSalt } from "bcrypt";
import Session from "./sessionService";
import { createToken } from "../utils/tokenUtils";
import sendMail from "../config/mailer";
import { PORT } from '../utils/env'

class UserService {
  private logInfo: string = "";
  private domain = `localhost:${PORT}/admin/user/`

  public async create(user: UserType): Promise<UserType> {
    try {
      const salt = await bcrypt.genSalt();

      user.password = await bcrypt.hash(user.password, salt);
      const newUser = await Repo.create(user);
      const context: object = {}
      // send verification email
      const token: string = createToken(newUser.email);
      (context as any).verificationLink = `${this.domain}verify?token=${token}`
      const { email } = newUser
      await sendMail(email, "Verify Your Email Address", "verification", context)
      // const verificationCode = await this.generateVerification(
      //   newUser._id as string
      // );
      // const HTML = `Hello <b>${newUser.username}</b>, verify your account <br/>
      // <button onClick=(copyText(${verificationCode})) >Copy verification Code</button> <br/>
      // and <a href="${APP_BASE_URL}">goto app </a> or
      // `;
      // await EmailService.sendEmail(
      //   {
      //     to: newUser.email,
      //     subject: "Verify Account",
      //     html: HTML,
      //   },
      //   {
      //     link: `${APP_BASE_URL}?verificationCode=${verificationCode}`,
      //     label: "Verify Account",
      //   }
      // );
      return newUser;
    } catch (error: any) {
      console.log({ error });
      this.logInfo = `${HELPERS.loggerInfo.error} creating ${user.username
        } @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  public async login(user: { email: string; password: string }): Promise<any> {
    try {
      const fetchedUser = await Repo.Login(user?.email);
      this.logInfo = `${HELPERS.loggerInfo.success} logging in ${user.email
        } @ ${HELPERS.currentTime()}`;
      if (await bcrypt.compare(user?.password, fetchedUser.password)) {
        return await this.formatForReturn(fetchedUser);
      } else {
        throw errorHandler.CustomError(
          ErrorEnum[403],
          "Invalid user credentials"
        );
      }
    } catch (error: any) {
      this.logInfo = `${HELPERS.loggerInfo.error} logging in ${user.email
        } @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  public async logout(sessionId: string): Promise<string> {
    try {
      const session = await Session.endSession(sessionId);
      this.logInfo = `${HELPERS.loggerInfo.success
        } ended session: ${sessionId} @ ${HELPERS.currentTime()}`;
      return session;
    } catch (error: any) {
      this.logInfo = `${HELPERS.loggerInfo.error
        } ended session: ${sessionId} @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
  public async fetchUser(userId: string): Promise<UserType | null> {
    try {
      const fetchedUser = await Repo.fetchUser(userId);
      this.logInfo = `${HELPERS.loggerInfo.success
        } fetching user ${userId} @ ${HELPERS.currentTime()}`;
      return fetchedUser;
    } catch (error: any) {
      this.logInfo = `${HELPERS.loggerInfo.error
        } fetching user ${userId} @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  private async formatForReturn(user: UserType): Promise<any> {
    try {
      const token = await Session.create(user?._id as string);
      return {
        email: user.email,
        username: user.username,
        dp: user.dp,
        bio: user.bio,
        token: await HELPERS.ENCODE_Token(token?._id),
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
      await Repo.update({ password: hashedPassword }, userId);
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
      this.logInfo = `${HELPERS.loggerInfo.success
        } creating verification code for useerId: ${userId} @ ${HELPERS.currentTime()}`;

      return HELPERS.ENCODE_Token(token);
    } catch (error: any) {
      this.logInfo = `${HELPERS.loggerInfo.error
        } creating verification code for user ${userId} @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
}

export default new UserService();
