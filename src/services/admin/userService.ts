import userService from "../userService";
import userRepository from "../../db/repository/userRepository";
import errorHandler, { ErrorEnum } from "../../utils/error";
import Session from "../sessionService";
import { UsersTypes } from "../../db/models/utils";
import { UserResponse, UserType } from "../../dto";
class AdminUserService {
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
    params: { search: string; account: UsersTypes },
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

  async makeAssociate(userId: string, sessionId: string) {
    try {
      const session = await Session.getSession(sessionId);
      if (session.user.account !== UsersTypes.admin)
        throw await errorHandler.CustomError(ErrorEnum[403], "Unauthorized");
      const user = await userService.updateUser(
        { account: UsersTypes.associate },
        userId
      );
      return await userService.formatUser(user);
    } catch (error: any) {
      throw error;
    }
  }
}

export default new AdminUserService();
