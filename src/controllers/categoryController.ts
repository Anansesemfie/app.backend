import CustomError, { CustomErrorHandler } from "../utils/CustomError";
import categoryService from "../services/categoryService";
import { Request, Response } from "express";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.fetchAllCategories();
    res.status(200).json({ data: categories });
  } catch (error: any) {
    CustomErrorHandler.handle(error, res);
  }
};
