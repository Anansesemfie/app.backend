import repo from '../db/repository/categoryRepository';
import errorHandler, { ErrorEnum } from "../utils/error";

class CategoryService {

   async fetchCategory(term: string) {
    try {
      const categories = await repo.getById(term);
      if(!categories) throw await errorHandler.CustomError(ErrorEnum[404], "Category not found");
      return categories;
    } catch (error: any) {
      throw error;
    }
}
}

export default new CategoryService();