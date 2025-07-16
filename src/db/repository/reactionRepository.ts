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
    const reaction = await Reaction.findOne({
      bookID: bookId,
      user: userId,
    });
    return reaction;
  }
  public async getReactions(
    bookId: string,
    params?: {}
  ): Promise<ReactionType[]> {
    const reactions = await Reaction.find({
      bookID: bookId,
      deletedAt: null,
      ...params,
    });
    return reactions;
  }
  public async getAllReactions(bookID: string): Promise<ReactionType[]> {
    const reactions = await Reaction.find({ bookID: bookID });
    return reactions;
  }
  public async deleteReactions(reactionID: string): Promise<void> {
    await Reaction.findByIdAndDelete(reactionID);
  }

  public async updateReaction(
    reactionID: string,
    reaction: ReactionType
  ): Promise<ReactionType> {
    const updatedReaction = await Reaction.findByIdAndUpdate(
      reactionID,
      reaction,
      { new: true }
    );
    return updatedReaction;
  }
}

export default new ReactionRepository();
