import { GenreType, GenreResponseType } from "../dto";
import repo from "../db/repository/genreRepository";
import booksRepo from "../db/repository/booksRepository";
import sessionService from "./sessionService";
import { ErrorEnum } from "../utils/error";
import { UsersTypes } from "../db/models/utils";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import { CacheService } from "./utils/cacheService";

class GenreService {
  async createGenre(data: GenreType, session: string): Promise<GenreResponseType> {
    const { user } = await sessionService.getSession(session);
    if (user.account !== UsersTypes.admin) {
      throw new CustomError(
        ErrorEnum[403],
        "You are not authorized to create a genre",
        ErrorCodes.FORBIDDEN
      );
    }
    const genre = await repo.create(data);
    await CacheService.clearPattern("genres:*");
    return this.formatGenre(genre);
  }

  async updateGenre(id: string, data: Partial<GenreType>, session: string): Promise<GenreResponseType> {
    const { user } = await sessionService.getSession(session);
    if (user.account !== UsersTypes.admin) {
      throw new CustomError(
        ErrorEnum[403],
        "You are not authorized to update a genre",
        ErrorCodes.FORBIDDEN
      );
    }
    const genre = await repo.updateById(id, data);
    if (!genre) {
      throw new CustomError(
        ErrorEnum[404],
        "Genre not found",
        ErrorCodes.NOT_FOUND
      );
    }
    await CacheService.clearPattern("genres:*");
    return this.formatGenre(genre);
  }

  async deleteGenre(id: string, session: string): Promise<void> {
    const { user } = await sessionService.getSession(session);
    if (user.account !== UsersTypes.admin) {
      throw new CustomError(
        ErrorEnum[403],
        "You are not authorized to delete a genre",
        ErrorCodes.FORBIDDEN
      );
    }
    const books = await booksRepo.fetchAll(1, 1, { genres: { $in: [id] } });
    if (books.length > 0) {
      throw new CustomError(
        ErrorEnum[400],
        "Cannot delete genre: it is associated with one or more books",
        ErrorCodes.BAD_REQUEST
      );
    }
    await repo.deleteById(id);
    await CacheService.clearPattern("genres:*");
  }

  async fetchGenre(id: string): Promise<GenreResponseType> {
    const cacheKey = `genres:one:id:${id}`;
    const cached = await CacheService.get<GenreResponseType>(cacheKey);
    if (cached) return cached;

    const genre = await repo.getById(id);
    if (!genre) {
      throw new CustomError(
        ErrorEnum[404],
        "Genre not found",
        ErrorCodes.NOT_FOUND
      );
    }

    const result = this.formatGenre(genre);
    await CacheService.set(cacheKey, result, 3600);
    return result;
  }

  async fetchAllGenres({
    limit = 10,
    page = 1,
    search = "",
  }: {
    limit?: number;
    page?: number;
    search?: string;
  } = {}): Promise<{
    genres: GenreResponseType[];
    total: number;
    page: number;
    limit: number;
  }> {
    const cacheKey = `genres:list:l:${limit}:p:${page}:s:${search}`;
    const cached = await CacheService.get<any>(cacheKey);
    if (cached) return cached;

    const { genres, total } = await repo.getAll(limit, page, { search });
    const formattedGenres = genres.map((genre) => this.formatGenre(genre));
    const result = { genres: formattedGenres, total, page, limit };
    await CacheService.set(cacheKey, result, 3600);
    return result;
  }

  async toggleGenreActive(id: string, session: string): Promise<GenreResponseType> {
    const { user } = await sessionService.getSession(session);
    if (user.account !== UsersTypes.admin) {
      throw new CustomError(
        ErrorEnum[403],
        "You are not authorized to toggle a genre",
        ErrorCodes.FORBIDDEN
      );
    }
    const genre = await repo.getById(id);
    if (!genre) {
      throw new CustomError(
        ErrorEnum[404],
        "Genre not found",
        ErrorCodes.NOT_FOUND
      );
    }
    const updated = await repo.updateById(id, { active: !genre.active });
    await CacheService.clearPattern("genres:*");
    return this.formatGenre(updated!);
  }

  private formatGenre(genre: GenreType): GenreResponseType {
    return {
      id: genre._id?.toString() || "",
      name: genre.title,
      active: genre.active ?? true,
    };
  }
}

export default new GenreService();
