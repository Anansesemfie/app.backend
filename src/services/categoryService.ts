import { CategoryType } from '../dto';
import repo from '../db/repository/categoryRepository';
import errorHandler, { ErrorEnum } from "../utils/error";

class CategoryService {
  async fetchCategory(term: string) {
    try {
      const categories = await repo.getById(term);
      if (!categories)
        throw await errorHandler.CustomError(
          ErrorEnum[404],
          "Category not found"
        );
      return await this.formatCategory(categories);
    } catch (error: any) {
      throw error;
    }
  }

  async fetchAllCategories() {
    try {
      const categories = await repo.getAll();
      if (!categories)
        throw await errorHandler.CustomError(
          ErrorEnum[404],
          "Category not found"
        );
      return Promise.all(categories.map((category) => this.formatCategory(category)));
    } catch (error: any) {
      throw error;
    }
  }

  private async formatCategory(category: CategoryType) {
    return {
      id: category._id,
      name: category.title,
    };
  }
}

export default new CategoryService();