import Repo from "../db/repository/sessionRepository";
import { sessionsDTO } from "../dto";
import HELPERS from "../utils/helpers";

class SessionService {
  private logInfo = new String();
  private options = {
    duration: 5000,
    external: false,
  };
  public async create(userID: string, options: { duration: number; external: boolean } = this.options
  ): Promise<sessionsDTO> {
    try {
      const now = new Date();
      const expirationTime = new Date(now.getTime() + options.duration).toString();
      const session: sessionsDTO = {
        user: userID,
        external: options?.external,
        duration: options?.duration,
        expiredAt: expirationTime
      };

      return await Repo.create(session);
    } catch (error: any) {
      throw new Error(error);
    }
  }
  public async getSession(sessionId: string): Promise<sessionsDTO> {
    try {
      return await Repo.fetchOne(sessionId);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async endSession(sessionId: string): Promise<string> {
    try {
      const end = { expiredAt: HELPERS.currentTime().toString() };
      const session = await Repo.update(sessionId, end);
      console.log("sessionDetails:", session, sessionId);
      if (session) {
        return "Success";
      }
      return "Error";
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async validateResetToken(token: string): Promise<string> {
    try {
      const session: sessionsDTO | any = await Repo.fetchOneByToken(token);
      if (!session || new Date(session.expiredAt) < new Date()) {
        throw new Error("Invalid or expired token");
      }
      return session.user;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new SessionService();
