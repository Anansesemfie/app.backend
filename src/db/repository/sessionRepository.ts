import { sessionsDTO } from "../../dto";
import { Session } from "../models";

class SessionRepository {
  public async create(session: sessionsDTO): Promise<sessionsDTO> {
    try {
      return await Session.create(session);
    } catch (error) {
      throw new Error(error);
    }
  }
  public async fetchOne(sessionId: string): Promise<sessionsDTO> {
    try {
      const fetchedSession = await Session.findOne({
        _id: sessionId,
      });
      return fetchedSession;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async update(sessionId: string, session): Promise<sessionsDTO> {
    try {
      const updatedSession = await Session.findOneAndUpdate(
        { _id: sessionId },
        session,
        {
          new: true,
        }
      );
      return updatedSession;
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new SessionRepository();
