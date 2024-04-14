import { ReactionType } from "../dto";
import reactionRepository from "../db/repository/reactionRepository";
import sessionService from "./sessionService";
import booksService from "./booksService";
import errorHandler, { ErrorEnum } from "../utils/error";
import HELPERS from "../utils/helpers";

class ReactionService {
  private logInfo = "";
  public async createReaction({
    sessionID,
    bookID,
    action,
  }: {
    sessionID: string;
    bookID: string;
    action: "Liked" | "Disliked";
  }): Promise<ReactionType> {
    try {
      if (!sessionID || !bookID || !action) {
        throw await errorHandler.CustomError(
          ErrorEnum[403],
          "Invalid user, book or action"
        );
      }
      const session = await sessionService.getSession(sessionID);
      console.log({ session });
      const reactionRes = await reactionRepository.getReaction(
        bookID,
        String(session.user)
      );

      if (reactionRes) {
        return this.updateReaction({ reaction: reactionRes, action });
      }
      const newReaction = await reactionRepository.create({
        bookID,
        user: session?.user as string,
        action: action,
      });
      this.logInfo = `${HELPERS.loggerInfo.success} ${
        session?.user
      } ${action} book: ${bookID} @ ${HELPERS.currentTime()}`;
      return newReaction;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } user with session: ${sessionID} failed to ${action} book: ${bookID} @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
  public async updateReaction({
    reaction,
    action,
  }: {
    reaction: ReactionType;
    action: "Liked" | "Disliked";
  }): Promise<ReactionType> {
    try {
      if (!reaction || !action) {
        throw await errorHandler.CustomError(
          ErrorEnum[403],
          "Invalid book ID or action"
        );
      }
      if (action == reaction.action) {
        throw await errorHandler.CustomError(
          ErrorEnum[403],
          "Can not take same action twice"
        );
      }
      const react: ReactionType = {
        bookID: reaction.bookID,
        user: reaction.user,
        action,
      };
      const updatedReaction = await reactionRepository.updateReaction(
        reaction?._id as string,
        react
      );
      this.logInfo = `${HELPERS.loggerInfo.success} ${
        reaction.user
      } ${action} book: ${reaction.bookID} @ ${HELPERS.currentTime()}`;
      return updatedReaction;
    } catch (error: any) {
      this.logInfo = `${HELPERS.loggerInfo.error} user with session: ${
        reaction.user
      } failed to ${action} book: ${
        reaction.bookID
      } @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
}

export default new ReactionService();
