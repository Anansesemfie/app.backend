import Repo from "../db/repository/sessionRepository";
import userService from "./userService";
import { SessionType, UserType } from "../dto";
import HELPERS from "../utils/helpers";
import errorHandler, { ErrorEnum } from "../utils/error";
import dayjs from "dayjs";
import CustomError, { ErrorCodes } from "../utils/CustomError";

class SessionService {
  private logInfo = new String();
  private options = {
    duration: 5000,
    external: false,
  };
  private day = dayjs().add(1, "day").toDate();
  public async create(
    userID: string,
    options: { duration: number; external: boolean } = this.options
  ): Promise<SessionType> {
    try {
      const now = new Date();
      const expirationTime = dayjs(now).add(30, "day").toDate();
      const session: SessionType = {
        user: userID,
        external: options?.external,
        duration: options?.duration,
        expiredAt: String(expirationTime),
      };

      return await Repo.create(session);
    } catch (error: any) {
      throw error;
    }
  }
  public async getSession(
    sessionId: string
  ): Promise<{ session: SessionType; user: UserType }> {
    const session = await Repo.fetchOne(sessionId);
    if (!session) {
      throw new CustomError(
        "Session not found",
        "Invalid session ID",
        ErrorCodes.NOT_FOUND
      );
    }

    if (new Date(session.expiredAt) <= new Date()) {
      throw new CustomError(
        "Session expired",
        "Session expired",
        ErrorCodes.UNAUTHORIZED
      );
    }
    const user = await userService.fetchUser(session.user as string);

    if (!user) {
      throw errorHandler.CustomError(ErrorEnum[403], "Invalid User");
    }
    return { session, user };
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
