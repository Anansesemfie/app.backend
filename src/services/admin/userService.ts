import userService from "../userService";
import userRepository from "../../db/repository/userRepository";
import errorHandler, { ErrorEnum } from "../../utils/error";
import HELPERS from "../../utils/helpers";
import Session from "../sessionService";
import { UsersTypes } from "../../db/models/utils";
import { UserResponse, UserType } from "../../dto";
class AdminUserService {
  private logInfo = "";
  async create(user: UserType, sessionId: string) {
    try {
      const session = await Session.getSession(sessionId);
      if (session.user.account !== UsersTypes.admin)
        throw await errorHandler.CustomError(ErrorEnum[403], "Unauthorized");
      return await userService.create(user);
    } catch (error: any) {
      throw error;
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    try {
      const userRecord = await userRepository.fetchOneByEmail(email);
      if (
        userRecord?.account !== UsersTypes.admin &&
        userRecord?.account !== UsersTypes.associate
      ) {
        throw await errorHandler.CustomError(ErrorEnum[403], "Unauthorized");
      }

      return await userService.login({ email, password });
    } catch (error: any) {
      throw error;
    }
  }

  async fetchUsers(
    params: { search: string; account?: UsersTypes },
    sessionId: string
  ): Promise<UserResponse[]> {
    try {
      const filter = {
        email: { $regex: params.search }
      };
      const session = await Session.getSession(sessionId);
      if (session.user.account !== UsersTypes.admin)
        throw await errorHandler.CustomError(ErrorEnum[403], "Unauthorized");

      const users = await userRepository.fetchAll(filter);
      return Promise.all(
        users.map((user) => {
          return userService.formatUser(user);
        })
      );
    } catch (error: any) {
      throw error;
    }
  }

  async changeRole(userId: string, userType: UsersTypes, sessionId: string) {
    try {
      HELPERS.LOG("changing user role", userId, userType);
      const session = await Session.getSession(sessionId);
      if (session.user.account !== UsersTypes.admin)
        throw await errorHandler.CustomError(ErrorEnum[403], "Unauthorized");
      const user = await userService.updateUser({ account: userType }, userId);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } changing user role of id: ${userId} to ${userType} @ ${HELPERS.currentTime()}`;
      return await userService.formatUser(user);
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } changing user role @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
}

export default new AdminUserService();
