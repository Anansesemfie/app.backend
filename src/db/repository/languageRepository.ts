import { Language } from "../models/index";
import { LanguageType } from "../../dto";
import { ErrorEnum } from "../../utils/error";
import CustomError, { ErrorCodes } from "../../utils/CustomError";
class LanguageRepository {
  // Create a new language
  async create(languageData: any): Promise<LanguageType> {
    try {
      const newLanguage = await Language.create(languageData);
      return newLanguage;
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Failed to create language",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  // Get a language by ID
  async getById(id: string): Promise<LanguageType> {
    try {
      const language = await Language.findOne({
        title: id,
      });
      return language;
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Failed to get language",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  async getAll() {
    try {
      const languages = await Language.find();
      return languages;
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Failed to get languages",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  // Update a language by ID
  async updateById(id: string, languageData: any): Promise<LanguageType> {
    try {
      const updatedLanguage = await Language.findByIdAndUpdate(
        id,
        languageData,
        { new: true }
      );
      return updatedLanguage;
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Failed to update language",
        ErrorCodes.BAD_REQUEST
      );
    }
  }

  // Delete a language by ID
  async deleteById(id: string): Promise<void> {
    try {
      await Language.findByIdAndDelete(id);
    } catch (error) {
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Failed to delete language",
        ErrorCodes.BAD_REQUEST
      );
    }
  }
}

export default new LanguageRepository();
