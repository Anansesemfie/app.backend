import userService from "../userService";
import userRepository from "../../db/repository/userRepository";
import errorHandler, { ErrorEnum } from "../../utils/error";
import Session from "../sessionService";
import { UsersTypes } from "../../db/models/utils";
import { UserType } from "../../dto";
class AdminUserService {
  private logInfo: string = "";
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
      )
        throw await errorHandler.CustomError(ErrorEnum[403], "Unauthorized");
      return await userService.login({ email, password });
    } catch (error: any) {
      throw error;
    }
  }
}

export default new AdminUserService();
