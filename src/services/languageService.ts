import repo from "../db/repository/languageRepository";
import { LanguageType } from "../dto";
import errorHandler, { ErrorEnum } from "../utils/error";

class LanguageService {

    public async createLanguage(language:LanguageType,sessionID:string ) {
        try{
            if(sessionID) throw await errorHandler.CustomError(ErrorEnum[403], "Invalid session ID");
            const lang = await repo.create(language);
            return lang;
        }
        catch(error:any){
            throw error;
        }
    }

  public async getAllLanguages() {
    try {
      const langs = await repo.getAll();
      if (!langs){
        throw await errorHandler.CustomError(
          ErrorEnum[404],
          "Language not found"
        );}
        return Promise.all(langs.map((lang) => this.formatLanguage(lang)));
    } catch (error: any) {
      throw error;
    }
  }

  public async getLanguageById(language: string) {
    try {
      const lang = await repo.getById(language);
      if (!lang) {
        throw await errorHandler.CustomError(
          ErrorEnum[404],
          "Language not found"
        );
      }
      return lang._id;
    } catch (error: any) {
      throw error;
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
