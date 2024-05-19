import { User } from "../models";
import { UserType } from "../../dto/";
import errHandler, { ErrorEnum } from "../../utils/error";

class UserRepository {
  public async create(user: UserType): Promise<UserType> {
    try {
      return await User.create(user);
    } catch (error: any) {
      switch (error?.code) {
        case 11000:
          throw await errHandler.CustomError(
            ErrorEnum[401],
            "Email already exists"
          );
        case 11001:
          throw await errHandler.CustomError(
            ErrorEnum[401],
            "Username already exists"
          );
        default:
          throw await errHandler.CustomError(
            ErrorEnum[400],
            "Error creating user"
          );
      }
    }
  }

  public async Login(email: string): Promise<any> {
    try {
      const fetchedUser = await User.findOne({ email: email });
      return fetchedUser;
    } catch (error: any) {
      throw await errHandler.CustomError(ErrorEnum[400], "Error getting user");
    }
  }

  public async update(payload: {}, userId: string): Promise<any> {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        payload,
        {
          new: true,
        }
      );
      return updatedUser;
    } catch (error: any) {
      switch (error?.code) {
        case 11000:
          throw await errHandler.CustomError(
            ErrorEnum[401],
            "Email already exists"
          );
        case 11001:
          throw await errHandler.CustomError(
            ErrorEnum[401],
            "Username already exists"
          );
        default:
          throw await errHandler.CustomError(
            ErrorEnum[400],
            "Error updating user"
          );
      }
    }
  }

  public async fetchUser(userId: string) {
    try {
      const fetchedUser = await User.findOne({ _id: userId });
      return fetchedUser;
    } catch (error: any) {
      throw await errHandler.CustomError(ErrorEnum[400], "Error fetching user");
    }
  }

  public async fetchOneByEmail(email: string): Promise<UserType | null> {
    try {
      return await User.findOne({ email });
    } catch (error: any) {
      throw await errHandler.CustomError(ErrorEnum[400], "Error fetching user");
    }
  }
}

export default new UserRepository();
