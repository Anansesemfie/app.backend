import reactionRepository from "../db/repository/reactionRepository";
import booksService from "./booksService";
import periodService from "./periodService";
import sessionService from "./sessionService";

import type { ReactionType } from "../dto";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import { ErrorEnum } from "../utils/error";

class ReactionService {
  public async createReaction({
    sessionID,
    bookID,
    action,
  }: {
    sessionID: string;
    bookID: string;
    action: "Liked" | "Disliked";
  }): Promise<ReactionType | null> {
    if (!sessionID || !bookID || !action) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid session ID, book ID or action",
        ErrorCodes.BAD_REQUEST
      );
    }
    const { session } = await sessionService.getSession(sessionID);
    const userId = session?.user as string;
    const period = await periodService.fetchLatest();
    if (!period) {
      throw new CustomError(
        ErrorEnum[404],
        "No active period found. Cannot create reaction.",
        ErrorCodes.NOT_FOUND
      );
    }

    const existingReaction = await reactionRepository.getReaction(bookID, userId);
    if (existingReaction) {
      return this.handleExistingReaction(existingReaction, bookID, action);
    }

    // Create new reaction
    const newReaction = await reactionRepository.create({
      bookID,
      user: userId,
      action,
      period: period._id,
    });

    await booksService.updateBookMeta(bookID, {
      meta: action === "Liked" ? "likes" : "dislikes",
      action: "Plus",
    });

    return newReaction;
  }

  private async handleExistingReaction(
    existingReaction: ReactionType,
    bookID: string,
    action: "Liked" | "Disliked"
  ): Promise<ReactionType | null> {
    if (existingReaction.action === action) {
      // Toggle off: delete and decrement
      await reactionRepository.deleteReactions(existingReaction._id as string);
      await booksService.updateBookMeta(bookID, {
        meta: action === "Liked" ? "likes" : "dislikes",
        action: "Minus",
      });
      return null;
    }

    // Switch action: update, decrement old, increment new
    const updated = await reactionRepository.updateReaction(
      existingReaction._id as string,
      { ...existingReaction, action }
    );
    await booksService.updateBookMeta(bookID, {
      meta: existingReaction.action === "Liked" ? "likes" : "dislikes",
      action: "Minus",
    });
    await booksService.updateBookMeta(bookID, {
      meta: action === "Liked" ? "likes" : "dislikes",
      action: "Plus",
    });
    return updated;
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
    if (action === reaction.action) {
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

  public async getReactions(
    bookID: string,
    params?: Record<string, unknown>
  ): Promise<ReactionType[]> {
    if (!bookID) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid book ID",
        ErrorCodes.BAD_REQUEST
      );
    }
    return reactionRepository.getReactions(bookID, params);
  }

  public async getUserReaction(userId: string): Promise<string[]> {
    if (!userId) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid user ID",
        ErrorCodes.BAD_REQUEST
      );
    }
    const reactions = await reactionRepository.getUserReactions(userId);
    return reactions
      .filter((reaction) => reaction.action === "Liked")
      .map((reaction) => reaction.bookID);
  }
}

export default new ReactionService();
