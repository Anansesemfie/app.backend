import { Comment } from "../models";
import errorHandle, { ErrorEnum } from "../../utils/error";
import { CommentType } from "../../dto";

class CommentRepository {
  public async create(comment: CommentType): Promise<CommentType> {
    try {
      const newComment = await Comment.create(comment);
      return newComment;
    } catch (error: any) {
      throw await errorHandle.CustomError(
        ErrorEnum[401],
        "Error creating comment"
      );
    }
  }

  public async getComments(
    bookId: string,
    params?: {}
  ): Promise<CommentType[]> {
    try {
      const comments = await Comment.find({ bookID: bookId, ...params });
      return comments;
    } catch (error: any) {
      throw await errorHandle.CustomError(
        ErrorEnum[400],
        "Error fetching comments"
      );
    }
  }

  public async deleteComment(commentId: string): Promise<void> {
    try {
      await Comment.findByIdAndDelete(commentId);
    } catch (error: any) {
      throw await errorHandle.CustomError(
        ErrorEnum[401],
        "Error deleting comment"
      );
    }
  }
  public async updateComment(
    commentId: string,
    comment: CommentType
  ): Promise<CommentType> {
    try {
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        comment,
        { new: true }
      );
      return updatedComment;
    } catch (error: any) {
      throw await errorHandle.CustomError(
        ErrorEnum[401],
        "Error updating comment"
      );
    }
  }
}

export default new CommentRepository();
