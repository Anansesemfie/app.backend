import repo from "../db/repository/languageRepository";
import sessionService from "./sessionService";
import { UsersTypes } from "../db/models/utils";
import { LanguageType } from "../dto";
import { ErrorEnum } from "../utils/error";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import { CacheService } from "./utils/cacheService";

class LanguageService {
  public async createLanguage(language: LanguageType, sessionID: string) {
    if (!sessionID) {
      throw new CustomError(
        ErrorEnum[403],
        "Invalid session ID",
        ErrorCodes.FORBIDDEN
      );
    }

    const { user } = await sessionService.getSession(sessionID);
    if (user.account !== UsersTypes.admin) {
      throw new CustomError(
        ErrorEnum[403],
        "You are not authorized to create a language",
        ErrorCodes.FORBIDDEN
      );
    }

    const lang = await repo.create(language);
    await CacheService.clearPattern("languages:*");
    return lang;
  }

  public async getAllLanguages() {
    const cacheKey = "languages:all";
    const cached = await CacheService.get<any[]>(cacheKey);
    if (cached) return cached;

    try {
      const langs = await repo.getAll();
      if (!langs) {
        throw new CustomError(
          ErrorEnum[404],
          "Languages not found",
          ErrorCodes.NOT_FOUND
        );
      }
      const result = await Promise.all(langs.map((lang) => this.formatLanguage(lang)));
      await CacheService.set(cacheKey, result, 3600);
      return result;
    } catch (error) {
      throw new CustomError(
        ErrorEnum[500],
        (error as Error).message ?? "Failed to get languages",
        ErrorCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async getLanguageById(language: string) {
    const cacheKey = `languages:one:id:${language}`;
    const cached = await CacheService.get<string>(cacheKey);
    if (cached) return cached;

    try {
      const lang = await repo.getById(language);
      if (!lang) {
        throw new CustomError(
          ErrorEnum[404],
          "Language not found",
          ErrorCodes.NOT_FOUND
        );
      }
      const result = lang._id;
      await CacheService.set(cacheKey, result, 3600);
      return result;
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
