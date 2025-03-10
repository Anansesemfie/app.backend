import Comments from "./commentService";
import seenService from "./seenService";
import reactionService from "./reactionService";
class Analysis {
  async analyzeBook(from: string, to: string, bookId: string) {
    try {
      const { seen, played } = await seenService.getSeensAndPlay(
        bookId,
        from,
        to
      );
      const comments = await Comments.getComments(bookId, {
        createdAt: { $gte: new Date(from), $lt: new Date(to) },
      });
      const likes = await reactionService.getReactions(bookId, {
        createdAt: { $gte: new Date(from), $lt: new Date(to) },
        action: "like",
      });
      const dislikes = await reactionService.getReactions(bookId, {
        createdAt: { $gte: new Date(from), $lt: new Date(to) },
        action: "dislike",
      });
      return [
        { label: "Seen", data: seen },
        { label: "Played", data: played },
        { label: "Comments", data: comments.length },
        { label: "Likes", data: likes.length },
        { label: "Dislikes", data: dislikes.length },
      ];
    } catch (error) {}
  }
}

export default new Analysis();
