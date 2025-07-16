import Comments from "./commentService";
import seenService from "./seenService";
import reactionService from "./reactionService";
import periodService from "./periodService";

import CustomError,{ ErrorCodes } from "../utils/CustomError";
class Analysis {
  async analyzeBook(bookId: string, period = ""):Promise<{
    label: string;
    data: number;
  }[]> {
    if (!bookId) {
      throw new CustomError(
        "Invalid book ID",
        "Invalid book ID",
        ErrorCodes.FORBIDDEN
      );
    }
    if (!period) {
      const latestPeriod = await periodService.fetchLatest();
      if (!latestPeriod) {
        throw new CustomError(
          "No period found",
          "No period found",
          ErrorCodes.NOT_FOUND
        );
      }
      period = latestPeriod._id as string;
    }
    
    const [{ seen, played }, comments, likes, dislikes] = await Promise.all([
      seenService.getSeensAndPlay(bookId, period),
      Comments.getComments(bookId, { period }),
      reactionService.getReactions(bookId, { period, action: "like" }),
      reactionService.getReactions(bookId, { period, action: "dislike" }),
    ]);
    return [
      { label: "Seen", data: seen },
      { label: "Played", data: played },
      { label: "Comments", data: comments.length },
      { label: "Likes", data: likes.length },
      { label: "Dislikes", data: dislikes.length },
    ];
  }
}

export default new Analysis();
