import { Author } from "../models/index";
import { AuthorType } from "../../dto";
import { ErrorEnum } from "../../utils/error";
import CustomError, { ErrorCodes } from "../../utils/CustomError";

class AuthorRepository {
  async create(authorData: AuthorType): Promise<AuthorType> {
    try {
      return await Author.create(authorData);
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error creating author",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  async getById(authorId: string): Promise<AuthorType | null> {
    try {
      return await Author.findById(authorId);
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error fetching author",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  async getAll(
    limit: number = 10,
    page: number = 1,
    params: any = {}
  ): Promise<{ authors: AuthorType[]; total: number }> {
    try {
      const { search, ...rest } = params;
      const query = { ...rest };
      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      const total = await Author.countDocuments(query);
      const authors = await Author.find(query)
        .skip(limit * (page - 1))
        .limit(limit)
        .sort({ name: 1 });
      return { authors, total };
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error fetching authors",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  async updateById(authorId: string, authorData: Partial<AuthorType>): Promise<AuthorType | null> {
    try {
      return await Author.findOneAndUpdate({ _id: authorId }, authorData, {
        new: true,
      });
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error updating author",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  async deleteById(authorId: string): Promise<void> {
    try {
      await Author.findByIdAndDelete(authorId);
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error deleting author",
        ErrorCodes.BAD_REQUEST
      );
    }
  }
}

export default new AuthorRepository();
