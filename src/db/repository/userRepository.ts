import { User } from "../models";
import { UserType } from "../../dto/userDTO.js";
import HELPERS from "../../utils/helpers";

class UserRepository {
  public async create(user: UserType): Promise<UserType> {
    try {
      return await User.create(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async fetchOne(user: {
    email: string;
    password: string;
  }): Promise<UserType> {
    try {
      console.log("email:", user);
      const fetchedUser = await User.findOne({ email: user?.email });
      return fetchedUser;
    } catch (error) {
      console.log("error", error);
      throw new Error(error);
    }
  }

  public async update(user: UserType, userId: string): Promise<UserType> {
    try {
      const updatedUser = await User.findOneAndUpdate({ _id: userId }, user, {
        new: true,
      });
      return updatedUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getAllUsers(): Promise<UserType[]> {
    try {
      const users = await User.find({});
      console.log({ users });
      return users;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new UserRepository();
