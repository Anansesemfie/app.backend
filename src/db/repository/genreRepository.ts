import { Genre } from "../models/index";
import { GenreType } from "../../dto";
import { ErrorEnum } from "../../utils/error";
import CustomError, { ErrorCodes } from "../../utils/CustomError";

class GenreRepository {
  async create(genreData: any): Promise<GenreType> {
    try {
      const genre = await Genre.create(genreData);
      return genre;
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error creating genre",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  async getById(genreId: string): Promise<GenreType> {
    try {
      const genre = await Genre.findOne({ _id: genreId });
      return genre;
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error fetching genre",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  async getAll(
    limit: number = 10,
    page: number = 1,
    params: any = {}
  ): Promise<{ genres: GenreType[]; total: number }> {
    try {
      const { search, sort = { title: 1 }, ...rest } = params;
      const query = { ...rest };
      if (search) {
        query.title = { $regex: search, $options: "i" };
      }

      const total = await Genre.countDocuments(query);
      const genres = await Genre.find(query)
        .skip(limit * (page - 1))
        .limit(limit)
        .sort(sort);
      return { genres, total };
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error fetching genres",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  async updateById(genreId: string, genreData: any): Promise<GenreType> {
    try {
      const updatedGenre = await Genre.findOneAndUpdate(
        { _id: genreId },
        genreData,
        {
          new: true,
        }
      );
      return updatedGenre;
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error updating genre",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  async deleteById(genreId: string): Promise<void> {
    try {
      await Genre.findByIdAndDelete(genreId);
    } catch (error) {
      throw new CustomError(
        ErrorEnum[500],
        (error as Error).message ?? "Error deleting genre",
        ErrorCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export default new GenreRepository();
