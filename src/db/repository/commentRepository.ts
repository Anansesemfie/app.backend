import { Comment } from "../models";
import { ErrorEnum } from "../../utils/error";
import { CommentType } from "../../dto";
import CustomError, { ErrorCodes } from "../../utils/CustomError";

class CommentRepository {
  public async create(comment: CommentType): Promise<CommentType> {
    const newComment = await Comment.create(comment);
    return newComment;
  }

  public async findById(commentId: string): Promise<CommentType | null> {
    if (!commentId) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid comment ID",
        ErrorCodes.FORBIDDEN
      );
    }
    const comment = await Comment.findById(commentId);
    return comment;
  }

  public async countComments(
    bookId: string,
    filters: Record<string, any> = {}
  ): Promise<number> {
    return Comment.countDocuments({
      bookID: bookId,
      parentId: null,
      deletedAt: null,
      ...filters,
    });
  }

  public async getComments(
    bookId: string,
    {
      skip = 0,
      limit = 20,
      ...filters
    }: { skip?: number; limit?: number } & Record<string, any> = {}
  ): Promise<CommentType[]> {
    const comments = await Comment.find({
      bookID: bookId,
      parentId: null,
      deletedAt: null,
      ...filters,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user");
    return comments;
  }

  public async getReplies(parentIds: string[]): Promise<CommentType[]> {
    if (!parentIds.length) return [];
    const replies = await Comment.find({
      parentId: { $in: parentIds },
      deletedAt: null,
    })
      .sort({ createdAt: 1 })
      .populate("user");
    return replies;
  }

  public async softDelete(commentId: string, deletedAt: Date): Promise<void> {
    if (!commentId) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid comment ID",
        ErrorCodes.FORBIDDEN
      );
    }
    await Comment.findByIdAndUpdate(commentId, { deletedAt });
  }

  public async softDeleteReplies(
    parentId: string,
    deletedAt: Date
  ): Promise<void> {
    if (!parentId) return;
    await Comment.updateMany({ parentId }, { deletedAt });
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
