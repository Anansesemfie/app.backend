import { CategoryType } from '../dto';
import repo from '../db/repository/categoryRepository';
import errorHandler, { ErrorEnum } from "../utils/error";
import CustomError, { ErrorCodes } from "../utils/CustomError";

class CategoryService {
  async fetchCategory(term: string) {
    
      const categories = await repo.getById(term);
      if (!categories){
         throw new CustomError(ErrorEnum[404],
          "Category not found",
          ErrorCodes.NOT_FOUND
        );
      }
        
      return await this.formatCategory(categories);
    
  }

  async fetchAllCategories() {
      const categories = await repo.getAll();
      if (!categories){
        throw new CustomError(ErrorEnum[404],
          "Category not found",
          ErrorCodes.NOT_FOUND
        );
      }
        
      return Promise.all(categories.map((category) => this.formatCategory(category)));
    
  }

  private async formatCategory(category: CategoryType) {
    return {
      id: category._id,
      name: category.title,
    };
  }
}

export default new CategoryService();