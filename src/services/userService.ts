import userRepository from "../db/repository/userRepository";
import { UserType, userReturn } from "../dto/userDTO";
import HELPERS from "../utils/helpers";
import bcrypt from "bcrypt";

class UserService {
  private logInfo: string = "";
  public async create(user: UserType): Promise<UserType> {
    try {
      return await userRepository.create(user);
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
      console.log("user:", user);
      const fetchedUser = await userRepository.fetchOne(user);
      console.log("fetchedUser:", fetchedUser);

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

  public async getUsers() {
    try {
      const users = await userRepository.getAllUsers();
      return users;
    } catch (error) {
      throw new Error(error);
    }
  }

  private async formatForReturn(user: UserType): Promise<userReturn> {
    try {
      return {
        email: user.email,
        username: user.username,
        dp: user.dp,
        bio: user.bio,
        token: await HELPERS.ENCODE_Token(user._id),
        subscription: {
          active: user.subscription ? true : false,
          id: user.subscription ? user.subscription.toString() : "",
        },
      };
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new UserService();
