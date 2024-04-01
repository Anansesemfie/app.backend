import Repo from "../db/repository/userRepository";
import { UserType, userReturn } from "../dto/userDTO";

import HELPERS from "../utils/helpers";
import bcrypt from "bcrypt";

import Session from "./sessionService";

class UserService {
  private logInfo: string = "";
  public async create(user: UserType): Promise<UserType> {
    try {
      return await Repo.create(user);
    } catch (error) {
      this.logInfo = `${HELPERS.loggerInfo.error} creating ${
        user.username
      } @ ${HELPERS.currentTime()}`;
      throw new Error(error);
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  public async login(user: { email: string; password: string }): Promise<any> {
    try {
      const fetchedUser = await Repo.fetchOne(user);
      this.logInfo = `${HELPERS.loggerInfo.success} logging in ${
        user.email
      } @ ${HELPERS.currentTime()}`;
      if (bcrypt.compare(user?.password, fetchedUser.password)) {
        return await this.formatForReturn(fetchedUser);
      }
    } catch (error) {
      this.logInfo = `${HELPERS.loggerInfo.error} logging in ${
        user.email
      } @ ${HELPERS.currentTime()}`;
      throw new Error(error);
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  public async logout(sessionId: string): Promise<string> {
    try {
      const session = await Session.endSession(sessionId);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } ended session: ${sessionId} @ ${HELPERS.currentTime()}`;
      return session;
    } catch (error) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } ended session: ${sessionId} @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  private async formatForReturn(user: UserType): Promise<userReturn> {
    try {
      const token = await Session.create(user?._id);
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
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new UserService();
