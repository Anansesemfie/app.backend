import { Category } from "../models/index";
import { CategoryType } from "../../dto";
import errHandler, { ErrorEnum } from "../../utils/error";

class CategoryRepository {
  // Create a new category
  async create(categoryData: any): Promise<CategoryType> {
    try {
      const category = await Category.create(categoryData);
      return category;
    } catch (error: any) {
      throw errHandler.CustomError(ErrorEnum[400], error?.message);
    }
  }

  // Get a category by ID
  async getById(categoryId: string): Promise<CategoryType> {
    try {
      const category = await Category.findOne({_id:categoryId,name:categoryId});
      return category;
    } catch (error: any) {
      throw errHandler.CustomError(ErrorEnum[400], error?.message);
    }
  }

  // Update a category by ID
  async updateById(
    categoryId: string,
    categoryData: any
  ): Promise<CategoryType> {
    try {
      const updatedCategory = await Category.findOneAndUpdate(
        { _id: categoryId },
        categoryData,
        {
          new: true,
        }
      );
      return updatedCategory;
    } catch (error: any) {
      throw errHandler.CustomError(ErrorEnum[400], error?.message);
    }
  }

  // Delete a category by ID
}

export default new CategoryRepository();
