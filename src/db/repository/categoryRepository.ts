import { Category } from "../models/index";
import { CategoryType } from "../../dto";
import { ErrorEnum } from "../../utils/error";
import CustomError,{ErrorCodes} from "../../utils/CustomError";

class CategoryRepository {
  // Create a new category
  async create(categoryData: any): Promise<CategoryType> {
    try {
      const category = await Category.create(categoryData);
      return category;
    } catch (error) {
      throw new CustomError(ErrorEnum[400], 
        (error as Error).message ?? 'Error creating category',
         ErrorCodes.BAD_REQUEST);
    }
  }

  // Get a category by ID
  async getById(categoryId: string): Promise<CategoryType> {
    try {
      const category = await Category.findOne({_id:categoryId,name:categoryId});
      return category;
    } catch (error) {
      throw new CustomError(ErrorEnum[400], 
        (error as Error).message ?? 'Error fetching category',
         ErrorCodes.BAD_REQUEST);
    }
  }
  async getAll(): Promise<CategoryType[]> {
    try {
      const categories = await Category.find();
      return categories;
    } catch (error) {
      throw new CustomError(ErrorEnum[400], 
        (error as Error).message ?? 'Error fetching categories',
         ErrorCodes.BAD_REQUEST);
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
    } catch (error) {
      throw new CustomError(ErrorEnum[400], 
        (error as Error).message ?? 'Error updating category',
         ErrorCodes.BAD_REQUEST);
    }
  }

  // Delete a category by ID
}

export default new CategoryRepository();
