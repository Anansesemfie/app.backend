import repo from "../db/repository/languageRepository";
import { LanguageType } from "../dto";
import { ErrorEnum } from "../utils/error";
import CustomError, { ErrorCodes } from "../utils/CustomError";

class LanguageService {
  public async createLanguage(language: LanguageType, sessionID: string) {
    if (sessionID) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid session ID",
        ErrorCodes.FORBIDDEN
      );
    }
    const lang = await repo.create(language);
    return lang;
  }

  public async getAllLanguages() {
    try {
      const langs = await repo.getAll();
      if (!langs) {
        throw new CustomError(
          ErrorEnum[404],
          "Languages not found",
          ErrorCodes.NOT_FOUND
        );
      }
      return Promise.all(langs.map((lang) => this.formatLanguage(lang)));
    } catch (error) {
      throw new CustomError(
        ErrorEnum[500],
        (error as Error).message ?? "Failed to get languages",
        ErrorCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async getLanguageById(language: string) {
    try {
      const lang = await repo.getById(language);
      if (!lang) {
        throw new CustomError(
          ErrorEnum[404],
          "Language not found",
          ErrorCodes.NOT_FOUND
        );
      }
      return lang._id;
    } catch (error) {
      throw new CustomError(
        ErrorEnum[500],
        (error as Error).message ?? "Failed to get language",
        ErrorCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async formatLanguage(language: LanguageType) {
    return {
      id: language._id,
      name: language.title,
    };
  }
}

export default new LanguageService();
