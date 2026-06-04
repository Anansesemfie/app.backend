import { Quote } from "../models";
import { QuoteType } from "../../dto";
import { ErrorEnum } from "../../utils/error";
import CustomError, { ErrorCodes } from "../../utils/CustomError";

class QuoteRepository {
  public async create(quote: QuoteType): Promise<QuoteType> {
    try {
      return await Quote.create(quote);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === "CastError" || error.name === "ValidationError")
      ) {
        throw error;
      }
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error creating quote",
        ErrorCodes.BAD_REQUEST,
      );
    }
  }

  public async fetchOne(quoteId: string): Promise<QuoteType> {
    try {
      const fetchedQuote = await Quote.findById(quoteId);
      return fetchedQuote;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === "CastError" || error.name === "ValidationError")
      ) {
        throw error;
      }
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error fetching quote",
        ErrorCodes.BAD_REQUEST,
      );
    }
  }

  public async update(
    quoteId: string,
    quote: Partial<QuoteType>,
  ): Promise<QuoteType> {
    try {
      const updatedQuote = await Quote.findByIdAndUpdate(quoteId, quote, {
        new: true,
      });
      return updatedQuote;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === "CastError" || error.name === "ValidationError")
      ) {
        throw error;
      }
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error updating quote",
        ErrorCodes.BAD_REQUEST,
      );
    }
  }

  public async delete(quoteId: string) {
    try {
      await Quote.findByIdAndDelete(quoteId);
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === "CastError" || error.name === "ValidationError")
      ) {
        throw error;
      }
      throw new CustomError(
        ErrorEnum[500],
        (error as Error).message ?? "Error deleting quote",
        ErrorCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async fetchAll(
    numberOfRecords: number = 10,
    page: number = 1,
    params: any = {},
  ): Promise<QuoteType[]> {
    try {
      const fetchedQuotes = await Quote.find(params)
        .skip(numberOfRecords * (page - 1))
        .limit(numberOfRecords)
        .sort({ createdAt: -1 });
      return fetchedQuotes;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === "CastError" || error.name === "ValidationError")
      ) {
        throw error;
      }
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error fetching quotes",
        ErrorCodes.BAD_REQUEST,
      );
    }
  }

  public async fetchActiveQuotes(): Promise<QuoteType[]> {
    try {
      const activeQuote = await Quote.find({ active: true }).sort({
        createdAt: -1,
      });
      return activeQuote;
    } catch (error) {
      if (
        error instanceof Error &&
        (error.name === "CastError" || error.name === "ValidationError")
      ) {
        throw error;
      }
      throw new CustomError(
        ErrorEnum[400],
        (error as Error).message ?? "Error fetching active quote",
        ErrorCodes.BAD_REQUEST,
      );
    }
  }
}

export default new QuoteRepository();
