import { Narrator } from "../models/index";
import { NarratorType } from "../../dto";
import { ErrorEnum } from "../../utils/error";
import CustomError, { ErrorCodes } from "../../utils/CustomError";

class NarratorRepository {
  async create(narratorData: NarratorType): Promise<NarratorType> {
    try {
      return await Narrator.create(narratorData);
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error creating narrator",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  async getById(narratorId: string): Promise<NarratorType | null> {
    try {
      return await Narrator.findById(narratorId);
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error fetching narrator",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  async getAll(
    limit: number = 10,
    page: number = 1,
    params: any = {}
  ): Promise<{ narrators: NarratorType[]; total: number }> {
    try {
      const { search, sort = { name: 1 }, ...rest } = params;
      const query = { ...rest };
      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      const total = await Narrator.countDocuments(query);
      const narrators = await Narrator.find(query)
        .skip(limit * (page - 1))
        .limit(limit)
        .sort(sort);
      return { narrators, total };
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error fetching narrators",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  async updateById(narratorId: string, narratorData: Partial<NarratorType>): Promise<NarratorType | null> {
    try {
      return await Narrator.findOneAndUpdate({ _id: narratorId }, narratorData, {
        new: true,
      });
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error updating narrator",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  async deleteById(narratorId: string): Promise<void> {
    try {
      await Narrator.findByIdAndDelete(narratorId);
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error deleting narrator",
        ErrorCodes.BAD_REQUEST
      );
    }
  }
}

export default new NarratorRepository();
