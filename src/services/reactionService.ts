import { ReactionType } from "../dto";
import reactionRepository from "../db/repository/reactionRepository";
import sessionService from "./sessionService";
import periodService from "./periodService";

import { ErrorEnum } from "../utils/error";
import CustomError, { ErrorCodes } from "../utils/CustomError";


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
      if (!sessionID || !bookID || !action) {
       throw new CustomError(
          ErrorEnum[403],
          "Invalid session ID, book ID or action",
          ErrorCodes.BAD_REQUEST
        );
      }
      const {session} = await sessionService.getSession(sessionID);
      const period = await periodService.fetchLatest();

      const newReaction = await reactionRepository.create({
        bookID,
        user: session?.user as string,
        action: action,
        period: period._id ?? "",
      });
      return newReaction;
  }
  public async updateReaction({
    reaction,
    action,
  }: {
    reaction: ReactionType;
    action: "Liked" | "Disliked";
  }): Promise<ReactionType> {
    if (!reaction || !action) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid book ID or action",
        ErrorCodes.BAD_REQUEST
      );
    }
    if (action == reaction.action) {
      throw new CustomError(
        ErrorEnum[403],
        "Can not take same action twice",
        ErrorCodes.BAD_REQUEST
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
      return updatedReaction;
  }

  public async getReactions(bookID: string, params?: {}): Promise<ReactionType[]> {

      if (!bookID) {
        throw new CustomError(ErrorEnum[403], "Invalid book ID", ErrorCodes.BAD_REQUEST);
      }
      const reactions = await reactionRepository.getReactions(bookID, params);
      return reactions;
    
  }
}

export default new ReactionService();
