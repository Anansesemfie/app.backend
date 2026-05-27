import { Comment } from "../../db/models";
import sessionService from "../sessionService";
import CustomError, { ErrorCodes } from "../../utils/CustomError";
import { ErrorEnum } from "../../utils/error";
import { UsersTypes } from "../../db/models/utils";

class ConversationService {
  private async assertAdmin(token: string) {
    const { user } = await sessionService.getSession(token);
    if (!user || user.account !== UsersTypes.admin) {
      throw new CustomError(ErrorEnum[403], "Forbidden", ErrorCodes.FORBIDDEN);
    }
  }

  async getComments(
    token: string,
    { page = 1, limit = 20, bookId }: { page?: number; limit?: number; bookId?: string }
  ) {
    await this.assertAdmin(token);

    const filter: Record<string, any> = { deletedAt: { $exists: false } };
    if (bookId) filter.bookID = bookId;

    const skip = (page - 1) * limit;

    const [results, total] = await Promise.all([
      (Comment as any)
        .find(filter)
        .populate("bookID", "title")
        .populate("user", "username dp")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Comment.countDocuments(filter),
    ]);

    const formatted = results.map((c: any) => ({
      id: c._id,
      comment: c.comment,
      createdAt: c.createdAt,
      book: { id: c.bookID?._id, title: c.bookID?.title ?? "—" },
      user: { id: c.user?._id, username: c.user?.username ?? "—", dp: c.user?.dp ?? "" },
    }));

    return { results: formatted, total, page };
  }

  async deleteComment(token: string, id: string) {
    await this.assertAdmin(token);
    await Comment.findOneAndUpdate({ _id: id }, { deletedAt: new Date() });
    return "comment deleted";
  }
}

export default new ConversationService();
