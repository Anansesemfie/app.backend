import { AuthorType, AuthorResponseType, SessionType } from "../dto";
import repo from "../db/repository/authorRepository";
import booksRepo from "../db/repository/booksRepository";
import sessionService from "./sessionService";
import { ErrorEnum } from "../utils/error";
import { UsersTypes } from "../db/models/utils";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import { sanitizeHtml } from "../utils/richText";

class AuthorService {
  async createAuthor(data: AuthorType, session: string): Promise<AuthorResponseType> {
    const { user } = await sessionService.getSession(session);
    if (user.account !== UsersTypes.admin) {
      throw new CustomError(
        ErrorEnum[403],
        "You are not authorized to create an author",
        ErrorCodes.FORBIDDEN
      );
    }
    if (data.bio) data.bio = sanitizeHtml(data.bio);
    const author = await repo.create(data);
    return this.formatAuthor(author);
  }

  async updateAuthor(id: string, data: Partial<AuthorType>, session: string): Promise<AuthorResponseType> {
    const { user } = await sessionService.getSession(session);
    if (user.account !== UsersTypes.admin) {
      throw new CustomError(
        ErrorEnum[403],
        "You are not authorized to update an author",
        ErrorCodes.FORBIDDEN
      );
    }
    if (data.bio) data.bio = sanitizeHtml(data.bio);
    const author = await repo.updateById(id, data);
    if (!author) {
      throw new CustomError(
        ErrorEnum[404],
        "Author not found",
        ErrorCodes.NOT_FOUND
      );
    }
    return this.formatAuthor(author);
  }

  async deleteAuthor(id: string, session: string): Promise<void> {
    const { user } = await sessionService.getSession(session);
    if (user.account !== UsersTypes.admin) {
      throw new CustomError(
        ErrorEnum[403],
        "You are not authorized to delete an author",
        ErrorCodes.FORBIDDEN
      );
    }
    const books = await booksRepo.fetchAll(1, 1, { authors: { $in: [id] } });
    if (books.length > 0) {
      throw new CustomError(
        ErrorEnum[400],
        "Cannot delete author: they are associated with one or more books",
        ErrorCodes.BAD_REQUEST
      );
    }
    await repo.deleteById(id);
  }

  async fetchAuthor(id: string): Promise<AuthorResponseType> {
    const author = await repo.getById(id);
    if (!author) {
      throw new CustomError(
        ErrorEnum[404],
        "Author not found",
        ErrorCodes.NOT_FOUND
      );
    }

    return this.formatAuthor(author);
  }

  async fetchAllAuthors({
    limit = 10,
    page = 1,
    search = "",
  }: {
    limit?: number;
    page?: number;
    search?: string;
  } = {}): Promise<{ authors: AuthorResponseType[]; total: number; page: number; limit: number }> {
    const { authors, total } = await repo.getAll(limit, page, { search });
    const formattedAuthors = await Promise.all(
      authors.map((author) => this.formatAuthor(author))
    );
    return { authors: formattedAuthors, total, page, limit };
  }

  private formatAuthor(author: AuthorType): AuthorResponseType {
    return {
      id: author._id?.toString() || "",
      name: author.name,
      bio: author.bio,
      active: author.active ?? true,
    };
  }
}

export default new AuthorService();
