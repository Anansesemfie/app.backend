import categoryService from "../services/categoryService";
import errorHandler from "../utils/error";
import { Request, Response } from "express";

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.fetchAllCategories();
        res.status(200).json({ data: categories });
    } catch (error: any) {
        const { code, message, exMessage } = await errorHandler.HandleError(
        error?.code,
        error?.message
        );
        res.status(code).json({ error: message, message: exMessage });
    }
}