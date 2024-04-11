import { sessionsDTO } from "../../dto";
import { Session } from "../models";

class SessionRepository {
  public async create(session: sessionsDTO): Promise<sessionsDTO> {
    try {
      return await Session.create(session);
    } catch (error: any) {
      throw new Error(error);
    }
  }
  public async fetchOne(sessionId: string): Promise<sessionsDTO | any> {
    try {
      const fetchedSession = await Session.findOne({
        _id: sessionId,
      });
      return fetchedSession;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async update(
    sessionId: string,
    session: sessionsDTO
  ): Promise<sessionsDTO | any> {
    try {
      const updatedSession = await Session.findOneAndUpdate(
        { _id: sessionId },
        session,
        {
          new: true,
        }
      );
      return updatedSession;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async fetchOneByToken(token: string): Promise<sessionsDTO | any> {
    try {
      const fetchedSession = await Session.findOne({
        token: token,
        // expiredAt: { $gt: new Date() },
      });
      return fetchedSession;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new SessionRepository();