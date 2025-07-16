import { SessionType } from "../../dto";
import { Session } from "../models";
import { ErrorEnum } from "../../utils/error";
import CustomError, { ErrorCodes } from "../../utils/CustomError";

class SessionRepository {
  public async create(session: SessionType): Promise<SessionType> {
    try {
      return await Session.create(session);
    } catch (error: any) {
      throw error;
    }
  }
  public async fetchOne(sessionId: string): Promise<SessionType> {
      const fetchedSession = await Session.findOne({
        _id: sessionId,
      });
      if (!fetchedSession) {
        throw new CustomError(
          ErrorEnum[404],
          "Session not found",
          ErrorCodes.NOT_FOUND
        );
      }
      return fetchedSession;
  }

  public async update(
    sessionId: string,
    session: SessionType
  ): Promise<SessionType | any> {
      const updatedSession = await Session.findOneAndUpdate(
        { _id: sessionId },
        session,
        {
          new: true,
        }
      );
      return updatedSession;
  }

  public async fetchOneByToken(token: string): Promise<SessionType | any> {
      const fetchedSession = await Session.findOne({
        token: token,
        // expiredAt: { $gt: new Date() },
      });
      return fetchedSession;
  }
}

export default new SessionRepository();
