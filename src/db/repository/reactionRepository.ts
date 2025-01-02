import { Reaction } from "../models";
import errorHandle, { ErrorEnum } from "../../utils/error";
import { ReactionType } from "../../dto";

class ReactionRepository {
  public async create(reaction: ReactionType): Promise<ReactionType> {
    try {
      return await Reaction.create(reaction);
    } catch (error: any) {
      throw await errorHandle.CustomError(
        ErrorEnum[401],
        "Error creating reaction"
      );
    }
  }
  public async getReaction(
    bookId: string,
    userId: string
  ): Promise<ReactionType> {
    try {
      console.log({ bookId, userId });
      const reaction = await Reaction.findOne({
        bookID: bookId,
        user: userId,
      });
      console.log({ reaction });
      return reaction;
    } catch (error: any) {
      throw await errorHandle.CustomError(
        ErrorEnum[401],
        "Error fetching reactions"
      );
    }
  }
  public async getReactions(
    bookId: string,
    params?: {}
  ): Promise<ReactionType[]> {
    try {
      const reactions = await Reaction.find({
        bookID: bookId,
        deletedAt: null,
        ...params,
      });
      return reactions;
    } catch (error: any) {
      throw await errorHandle.CustomError(
        ErrorEnum[400],
        "Error fetching reactions"
      );
    }
  }
  public async getAllReactions(bookID: string): Promise<ReactionType[]> {
    try {
      const reactions = await Reaction.find({ bookID: bookID });
      return reactions;
    } catch (error: any) {
      throw await errorHandle.CustomError(
        ErrorEnum[400],
        "Error fetching reactions"
      );
    }
  }
  public async deleteReactions(reactionID: string): Promise<void> {
    try {
      await Reaction.findByIdAndDelete(reactionID);
    } catch (error: any) {
      throw await errorHandle.CustomError(
        ErrorEnum[400],
        "Error deleting reaction"
      );
    }
  }

  public async updateReaction(
    reactionID: string,
    reaction: ReactionType
  ): Promise<ReactionType> {
    try {
      const updatedReaction = await Reaction.findByIdAndUpdate(
        reactionID,
        reaction,
        { new: true }
      );
      return updatedReaction;
    } catch (error: any) {
      throw await errorHandle.CustomError(
        ErrorEnum[400],
        "Error updating reaction"
      );
    }
  }
}

export default new ReactionRepository();
