import { CategoryType } from '../dto';
import repo from '../db/repository/categoryRepository';
import errorHandler, { ErrorEnum } from "../utils/error";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import { CacheService } from './utils/cacheService';

class CategoryService {
  async fetchCategory(term: string) {
      const cacheKey = `categories:one:id:${term}`;
      const cached = await CacheService.get<any>(cacheKey);
      if (cached) return cached;
    
      const categories = await repo.getById(term);
      if (!categories){
         throw new CustomError(ErrorEnum[404],
          "Category not found",
          ErrorCodes.NOT_FOUND
        );
      }
        
      const result = await this.formatCategory(categories);
      await CacheService.set(cacheKey, result, 3600);
      return result;
  }

  async fetchAllCategories() {
      const cacheKey = "categories:all";
      const cached = await CacheService.get<any[]>(cacheKey);
      if (cached) return cached;

      const categories = await repo.getAll();
      if (!categories){
        throw new CustomError(ErrorEnum[404],
          "Category not found",
          ErrorCodes.NOT_FOUND
        );
      }
        
      const result = await Promise.all(categories.map((category) => this.formatCategory(category)));
      await CacheService.set(cacheKey, result, 3600);
      return result;
  }

  private async formatCategory(category: CategoryType) {
    return {
      id: category._id,
      name: category.title,
    };
  }
}

export default new CategoryService();