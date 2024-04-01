import Repo from "../db/repository/sessionRepository";
import { sessionsDTO } from "../dto";
import HELPERS from "../utils/helpers";

class SessionService {
  private logInfo = new String();
  private options = {
    duration: 5000,
    external: false,
  };
  public async create(
    userID: string,
    options: { duration: number; external: boolean } = this.options
  ): Promise<sessionsDTO> {
    try {
      const session: sessionsDTO = {
        user: userID,
        external: options?.external,
        duration: options?.duration,
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
}

export default new SessionService();
