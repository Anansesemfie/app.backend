import Repo from "../db/repository/sessionRepository";
import userService from "./userService";
import { SessionType, UserType } from "../dto";
import HELPERS from "../utils/helpers";
import errorHandler, { ErrorEnum } from "../utils/error";

class SessionService {
  private logInfo = new String();
  private options = {
    duration: 5000,
    external: false,
  };
  public async create(
    userID: string,
    options: { duration: number; external: boolean } = this.options
  ): Promise<SessionType> {
    try {
      const now = new Date();
      const expirationTime = new Date(
        now.getTime() + options.duration
      ).toString();
      const session: SessionType = {
        user: userID,
        external: options?.external,
        duration: options?.duration,
        expiredAt: expirationTime,
      };

      return await Repo.create(session);
    } catch (error: any) {
      throw error;
    }
  }
  public async getSession(
    sessionId: string
  ): Promise<{ session: SessionType; user: UserType }> {
    try {
      const session = await Repo.fetchOne(sessionId);
      if (!session) {
        throw errorHandler.CustomError(ErrorEnum[403], "Invalid Session ID");
      }
      if (new Date(session.expiredAt) > new Date()) {
        throw errorHandler.CustomError(ErrorEnum[403], "Session expired");
      }
      const user = await userService.fetchUser(session.user as string);

      if (!user) {
        throw errorHandler.CustomError(ErrorEnum[403], "Invalid User");
      }
      return { session, user };
    } catch (error: any) {
      throw error;
    }
  }

  public async endSession(sessionId: string): Promise<string> {
    try {
      const end = { expiredAt: HELPERS.currentTime().toString() };
      const session = await Repo.update(sessionId, end);
      if (session) {
        return "Success";
      }
      return "Error";
    } catch (error: any) {
      throw error;
    }
  }

  public async validateResetToken(token: string): Promise<string> {
    try {
      const session: SessionType | any = await Repo.fetchOneByToken(token);
      if (!session || new Date(session.expiredAt) < new Date()) {
        throw new Error("Invalid or expired token");
      }
      return session.user;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new SessionService();
