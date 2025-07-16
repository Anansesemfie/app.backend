import userService from "../userService";
import userRepository from "../../db/repository/userRepository";
import errorHandler, { ErrorEnum } from "../../utils/error";
import CustomError,{ErrorCodes} from "../../utils/CustomError";
import HELPERS from "../../utils/helpers";
import Session from "../sessionService";
import { UsersTypes } from "../../db/models/utils";
import { UserResponse, UserType } from "../../dto";
class AdminUserService {
  private logInfo = "";
  async create(user: UserType, sessionId: string) {
    const session = await Session.getSession(sessionId);
    if (session.user.account !== UsersTypes.admin){
      throw new CustomError(
        ErrorEnum[403],
        "Unauthorized to create user",
        ErrorCodes.UNAUTHORIZED
      )
    }
      
    return await userService.create(user);
  }

  async login({ email, password }: { email: string; password: string }) {
    
      const userRecord = await userRepository.fetchOneByEmail(email);
      HELPERS.LOG({userRecord})
      if (
        userRecord?.account !== UsersTypes.admin &&
        userRecord?.account !== UsersTypes.associate
      ) {
        throw new CustomError(
          ErrorEnum[404],
          "User not found or unauthorized",
          ErrorCodes.NOT_FOUND
        );
      }
      return await userService.login({ email, password });
    
  }

  async fetchUsers(
    params: { search: string; account?: UsersTypes },
    sessionId: string
  ): Promise<UserResponse[]> {
      const filter = {
        email: { $regex: params.search },
      };
      const session = await Session.getSession(sessionId);
      if (session.user.account !== UsersTypes.admin){
        throw new CustomError(
          ErrorEnum[403],
          "Unauthorized to fetch users",
          ErrorCodes.UNAUTHORIZED
        );
      }

      const users = await userRepository.fetchAll(filter);
      return Promise.all(
        users.map((user) => {
          return userService.formatUser(user);
        })
      );
  }

  async changeRole(userId: string, userType: UsersTypes, sessionId: string) {
    const session = await Session.getSession(sessionId);
    if (session.user.account !== UsersTypes.admin)
      throw new CustomError(
        ErrorEnum[403],
        "Unauthorized to change user role",
        ErrorCodes.UNAUTHORIZED
      );
    const user = await userService.updateUser({ account: userType }, userId);
    
    return await userService.formatUser(user);
  }
}

export default new AdminUserService();
