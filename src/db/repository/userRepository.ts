import { User } from "../models";
import { UserType } from "../../dto/userDTO";
import HELPERS from "../../utils/helpers";

class UserRepository {
  public async create(user: UserType): Promise<UserType> {
    try {
      return await User.create(user);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async fetchOne(user: {
    email: string;
    password: string;
  }): Promise<any> {
    try {
      console.log("email:", user);
      const fetchedUser = await User.findOne({ email: user?.email });
      return fetchedUser;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async update(user: UserType, userId: string): Promise<any> {
    try {
      const updatedUser = await User.findOneAndUpdate({ _id: userId }, user, {
        new: true,
      });
      return updatedUser;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async fetchUser(userId: string) {
    try {
      const fetchedUser = await User.findOne({ _id: userId });
      return fetchedUser;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new UserRepository();
