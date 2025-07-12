import bookService from "../../services/admin/bookService";
import chapterService from "../../services/admin/chapterService";
import analysisService from "../../services/analysisService";
import { Request, Response } from "express";
import ErrorHandler, { ErrorEnum } from "../../utils/error";

import errorHandler from "../../utils/error";

export const GenerateSignedUrl = async (req: Request, res: Response) => {
  try {
    let { file, fileType } = req.body;
    const token = res.locals.sessionId;
    const signedUrl = await bookService.getAWSURL(file, fileType, token);
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

//chapters
export const CreateChapter = async (req: Request, res: Response) => {
  try {
    const chapter = req.body;
    const token = res.locals.sessionId;
    const createdChapter = await chapterService.CreateChapter(chapter, token);
    res.status(200).json({ data: createdChapter });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const GetBookAnalysis = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const start = req.query.startDate as string;
    const end = req.query.endDate as string;
    const token = res.locals.sessionId;

    const analysis = await analysisService.analyzeBook(start, end, bookId);
    res.status(200).json({ data: analysis });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};


export const DeleteChapter = async (req: Request, res: Response) =>{
  try{
    const { chapterURL } = req.body;

    const result = await chapterService.deleteChapter(chapterURL);
    res.status(200).json(result);
  }catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
}