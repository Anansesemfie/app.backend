import { Language } from '../models/index';
import { LanguageType } from "../../dto";
import errHandler, { ErrorEnum } from "../../utils/error";

class LanguageRepository {

    // Create a new language
    async create(languageData: any): Promise<LanguageType> {
        try {
            const newLanguage = await Language.create(languageData);
            return newLanguage;
        } catch (error:any) {
            throw errHandler.CustomError(ErrorEnum[400], error?.message);
        }
    }

    // Get a language by ID
    async getById(id: string): Promise<LanguageType> {
        try {
            const language = await Language.findOne({
              title: id,
            });;
            return language;
        } catch (error:any) {
            throw errHandler.CustomError(ErrorEnum[400], error?.message);
        }
    }

    async getAll(){
        try {
            const languages = await Language.find();
            return languages;
        } catch (error:any) {
            throw errHandler.CustomError(ErrorEnum[400], error?.message);
        }
    }

    // Update a language by ID
    async updateById(id: string, languageData: any): Promise<LanguageType> {
        try {
            const updatedLanguage = await Language.findByIdAndUpdate(id, languageData, { new: true });
            return updatedLanguage;
        } catch (error:any) {
            throw errHandler.CustomError(ErrorEnum[400], error?.message);
        }
    }

    // Delete a language by ID
    async deleteById(id: string): Promise<void> {
        try {
            await Language.findByIdAndDelete(id);
        } catch (error:any) {
            throw errHandler.CustomError(ErrorEnum[400], error?.message);
        }
    }
}

export default new LanguageRepository();