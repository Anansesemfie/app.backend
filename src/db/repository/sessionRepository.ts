import { SessionType } from "../../dto";
import { Session } from "../models";
import errorHandler, { ErrorEnum } from "../../utils/error";

class SessionRepository {
  public async create(session: SessionType): Promise<SessionType> {
    try {
      return await Session.create(session);
    } catch (error: any) {
      throw error;
    }
  }
  public async fetchOne(sessionId: string): Promise<SessionType> {
    try {
      const fetchedSession = await Session.findOne({
        _id: sessionId,
      });
      if (!fetchedSession) {
        throw errorHandler.CustomError(ErrorEnum[403], "Invalid Session ID");
      }
      return fetchedSession;
    } catch (error: any) {
      throw error;
    }
  }

  public async update(
    sessionId: string,
    session: SessionType
  ): Promise<SessionType | any> {
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
      throw error;
    }
  }

  public async fetchOneByToken(token: string): Promise<SessionType | any> {
    try {
      const fetchedSession = await Session.findOne({
        token: token,
        // expiredAt: { $gt: new Date() },
      });
      return fetchedSession;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new SessionRepository();
