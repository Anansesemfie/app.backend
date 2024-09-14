import bookService from "../../services/admin/bookService";
import { Request, Response } from "express";

import errorHandler from "../../utils/error";

export const GenerateSignedUrl = async (req: Request, res: Response) => {
  try {
    let { file, fileType } = req.body;
    const signedUrl = await bookService.getAWSURL(file, fileType);
    res.status(200).json({ data: signedUrl });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const CreateBook = async (req: Request, res: Response) => {
  try {
    const book = req.body;
    const token = res.locals.sessionId;
    const createdBook = await bookService.CreateBook(book, token);
    res.status(200).json({ data: createdBook });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const UpdateBook = async (req: Request, res: Response) => {
  try {
    const book = req.body;
    const token = res.locals.sessionId;
    const updatedBook = await bookService.UpdateBook(book, token);
    res.status(200).json({ data: updatedBook });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};
