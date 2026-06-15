import { NarratorType, NarratorResponseType } from "../dto";
import repo from "../db/repository/narratorRepository";
import booksRepo from "../db/repository/booksRepository";
import sessionService from "./sessionService";
import { ErrorEnum } from "../utils/error";
import { UsersTypes } from "../db/models/utils";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import { sanitizeHtml } from "../utils/richText";

class NarratorService {
  async createNarrator(data: NarratorType, session: string): Promise<NarratorResponseType> {
    const { user } = await sessionService.getSession(session);
    if (user.account !== UsersTypes.admin) {
      throw new CustomError(
        ErrorEnum[403],
        "You are not authorized to create a narrator",
        ErrorCodes.FORBIDDEN
      );
    }
    if (data.bio) data.bio = sanitizeHtml(data.bio);
    const narrator = await repo.create(data);
    return this.formatNarrator(narrator);
  }

  async updateNarrator(id: string, data: Partial<NarratorType>, session: string): Promise<NarratorResponseType> {
    const { user } = await sessionService.getSession(session);
    if (user.account !== UsersTypes.admin) {
      throw new CustomError(
        ErrorEnum[403],
        "You are not authorized to update a narrator",
        ErrorCodes.FORBIDDEN
      );
    }
    if (data.bio) data.bio = sanitizeHtml(data.bio);
    const narrator = await repo.updateById(id, data);
    if (!narrator) {
      throw new CustomError(
        ErrorEnum[404],
        "Narrator not found",
        ErrorCodes.NOT_FOUND
      );
    }
    return this.formatNarrator(narrator);
  }

  async deleteNarrator(id: string, session: string): Promise<void> {
    const { user } = await sessionService.getSession(session);
    if (user.account !== UsersTypes.admin) {
      throw new CustomError(
        ErrorEnum[403],
        "You are not authorized to delete a narrator",
        ErrorCodes.FORBIDDEN
      );
    }
    const books = await booksRepo.fetchAll(1, 1, { narrators: { $in: [id] } });
    if (books.length > 0) {
      throw new CustomError(
        ErrorEnum[400],
        "Cannot delete narrator: they are associated with one or more books",
        ErrorCodes.BAD_REQUEST
      );
    }
    await repo.deleteById(id);
  }

  async fetchNarrator(id: string): Promise<NarratorResponseType> {
    const narrator = await repo.getById(id);
    if (!narrator) {
      throw new CustomError(
        ErrorEnum[404],
        "Narrator not found",
        ErrorCodes.NOT_FOUND
      );
    }

    return this.formatNarrator(narrator);
  }

  async fetchAllNarrators({
    limit = 10,
    page = 1,
    search = "",
    sort = { name: 1 },
  }: {
    limit?: number;
    page?: number;
    search?: string;
    sort?: any;
  } = {}): Promise<{ narrators: NarratorResponseType[]; total: number; page: number; limit: number }> {
    const { narrators, total } = await repo.getAll(limit, page, { search, sort });
    const formattedNarrators = await Promise.all(
      narrators.map((narrator) => this.formatNarrator(narrator))
    );
    return { narrators: formattedNarrators, total, page, limit };
  }

  private formatNarrator(narrator: NarratorType): NarratorResponseType {
    return {
      id: narrator._id?.toString() || "",
      name: narrator.name,
      bio: narrator.bio,
      active: narrator.active ?? true,
    };
  }
}

export default new NarratorService();
