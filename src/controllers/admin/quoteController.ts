import quoteAdminService from "../../services/admin/quoteService";
import { Request, Response } from "express";
import { CustomErrorHandler } from "../../utils/CustomError";

export const CreateQuote = async (req: Request, res: Response) => {
  try {
    const quote = req.body;
    const token = res.locals.sessionId;
    const createdQuote = await quoteAdminService.CreateQuote(quote, token);
    res.status(201).json({ data: createdQuote });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const UpdateQuote = async (req: Request, res: Response) => {
  try {
    const quote = req.body;
    const quoteId = req.params.id;
    const token = res.locals.sessionId;
    const updatedQuote = await quoteAdminService.UpdateQuote(quoteId, quote, token);
    res.status(203).json({ data: updatedQuote });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const DeleteQuote = async (req: Request, res: Response) => {
  try {
    const quoteId = req.params.id;
    const token = res.locals.sessionId;
    const result = await quoteAdminService.DeleteQuote(quoteId, token);
    res.status(200).json({ data: result });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const FetchAllQuotes = async (req: Request, res: Response) => {
  try {
    const token = res.locals.sessionId;
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    const quotes = await quoteAdminService.FetchAllQuotes(token, limit, page);
    res.status(200).json({ data: quotes });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const FetchQuote = async (req: Request, res: Response) => {
  try {
    const quoteId = req.params.id;
    const token = res.locals.sessionId;
    const quote = await quoteAdminService.FetchQuote(quoteId, token);
    res.status(200).json({ data: quote });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const FetchActiveQuotes = async (req: Request, res: Response) => {
  try {
    const quotes = await quoteAdminService.FetchActiveQuotes();
    res.status(200).json({ data: quotes });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
}
