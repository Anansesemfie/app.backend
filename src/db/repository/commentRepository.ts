import { Comment } from "../models";
import { ErrorEnum } from "../../utils/error";
import { CommentType } from "../../dto";
import CustomError, { ErrorCodes } from "../../utils/CustomError";

class CommentRepository {
  public async create(comment: CommentType): Promise<CommentType> {
      const newComment = await Comment.create(comment);
      return newComment;
   
  }

  public async getComments(
    bookId: string,
    params?: {}
  ): Promise<CommentType[]> {
      const comments = await Comment.find({ bookID: bookId, ...params });
      return comments;
  }

  public async deleteComment(commentId: string): Promise<void> {
    if (!commentId) {
        throw new CustomError(
          ErrorEnum[403],
          "Invalid comment ID",
          ErrorCodes.FORBIDDEN
        );
    }
      await Comment.findByIdAndDelete(commentId);
  }
  public async updateComment(
    commentId: string,
    comment: CommentType
  ): Promise<CommentType> {
      if (!commentId || !comment) {
        throw new CustomError(
          ErrorEnum[403],
          "Invalid comment ID or comment data",
          ErrorCodes.FORBIDDEN
        );
      }
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        comment,
        { new: true }
      );
      return updatedComment;
  }
}

export default new CommentRepository();
