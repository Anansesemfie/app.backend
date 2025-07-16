import { User } from "../models";
import type { UserType } from "../../dto/";
import { ErrorEnum } from "../../utils/error";
import CustomError, {ErrorCodes} from "../../utils/CustomError";

class UserRepository {
  public async create(user: UserType): Promise<UserType> {
      return await User.create(user);
  }

  public async Login(email: string): Promise<any> {
      const fetchedUser = await User.findOne({ email: email });
      if (!fetchedUser) {
       throw new CustomError(
         ErrorEnum[404],
         "User not found",
         ErrorCodes.NOT_FOUND
       );
      }
      return fetchedUser;
  
  }

  public async update(
    payload: Partial<UserType>,
    userId: string
  ): Promise<any> {
 
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        payload,
        {
          new: true,
        }
      );
      return updatedUser;
    
  }

  public async fetchUser(userId: string): Promise<UserType | null> {
      const fetchedUser = await User.findOne({ _id: userId });
      return fetchedUser;
  }

  public async fetchAll(params: {}, limit = 100): Promise<UserType[]> {
      return await User.find({ ...params })
        .limit(limit)
        .sort({ createdAt: -1 });
  }

  public async fetchOneByEmail(email: string): Promise<UserType | null> {
      return await User.findOne({ email });
  }

  public async fetchOneByKey(key: string): Promise<UserType | null> {
      const user = await User.findOne({ key });
      return user;
  }
}

export default new UserRepository();
