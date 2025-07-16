import bookService from "../../services/admin/bookService";
import chapterService from "../../services/admin/chapterService";
import analysisService from "../../services/analysisService";
import { Request, Response } from "express";
import { CustomErrorHandler } from "../../utils/CustomError";

export const GenerateSignedUrl = async (req: Request, res: Response) => {
  try {
    let { file, fileType } = req.body;
    const token = res.locals.sessionId;
    const signedUrl = await bookService.getAWSURL(file, fileType, token);
    res.status(200).json({ data: signedUrl });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const CreateBook = async (req: Request, res: Response) => {
  try {
    const book = req.body;
    const token = res.locals.sessionId;
    const createdBook = await bookService.CreateBook(book, token);
    res.status(201).json({ data: createdBook });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const UpdateBook = async (req: Request, res: Response) => {
  try {
    const book = req.body;
    const bookId = req.params.id;
    const token = res.locals.sessionId;
    const updatedBook = await bookService.UpdateBook(bookId, book, token);
    res.status(203).json({ data: updatedBook });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const DeleteBook = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.id;
    const token = res.locals.sessionId;
    const update = await bookService.DeleteBook(bookId, token);
    res.status(200).json({ data: update });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

//chapters
export const CreateChapter = async (req: Request, res: Response) => {
  try {
    const chapter = req.body;
    const token = res.locals.sessionId;
    const createdChapter = await chapterService.CreateChapter(chapter, token);
    res.status(201).json({ data: createdChapter });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const GetBookAnalysis = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    const period = req.query.period as string;
    const analysis = await analysisService.analyzeBook(bookId, period);
    res.status(200).json({ data: analysis });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const DeleteChapter = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const token = res.locals.sessionId;
    const result = await chapterService.deleteChapter(id, token);
    res.status(200).json(result);
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const UpdateChapter = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const chapter = req.body;
    const token = res.locals.sessionId;
    const result = await chapterService.updateChapter(id, chapter, token);
    res.status(203).json({ data: result });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
