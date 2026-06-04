import quoteRepository from "../../db/repository/quoteRepository";
import { QuoteType } from "../../dto";
import sessionService from "../sessionService";
import { UsersTypes } from "../../db/models/utils";
import CustomError, { ErrorCodes } from "../../utils/CustomError";
import { ErrorEnum } from "../../utils/error";

class QuoteAdminService {
  public async CreateQuote(
    quote: QuoteType,
    token: string,
  ): Promise<QuoteType> {
    const { user } = await sessionService.getSession(token);
    this.checkForAdmin(user);
    return await quoteRepository.create(quote);
  }

  public async UpdateQuote(
    id: string,
    quote: Partial<QuoteType>,
    token: string,
  ): Promise<QuoteType> {
    const { user } = await sessionService.getSession(token);
    this.checkForAdmin(user);
    if (!id) {
      throw new CustomError(
        ErrorEnum[401],
        "Quote ID is required",
        ErrorCodes.BAD_REQUEST,
      );
    }
    return await quoteRepository.update(id, quote);
  }

  public async DeleteQuote(id: string, token: string): Promise<string> {
    const { user } = await sessionService.getSession(token);
    this.checkForAdmin(user);
    if (!id) {
      throw new CustomError(
        ErrorEnum[401],
        "Quote ID is required",
        ErrorCodes.BAD_REQUEST,
      );
    }
    await quoteRepository.delete(id);
    return "Quote deleted successfully";
  }

  public async FetchAllQuotes(
    token: string,
    limit: number = 10,
    page: number = 1,
  ): Promise<QuoteType[]> {
    const { user } = await sessionService.getSession(token);
    this.checkForAdmin(user);
    return await quoteRepository.fetchAll(limit, page);
  }

  public async FetchQuote(id: string, token: string): Promise<QuoteType> {
    const { user } = await sessionService.getSession(token);
    this.checkForAdmin(user);
    if (!id) {
      throw new CustomError(
        ErrorEnum[401],
        "Quote ID is required",
        ErrorCodes.BAD_REQUEST,
      );
    }
    return await quoteRepository.fetchOne(id);
  }

  private checkForAdmin(user: any): void {
    if (!user || user?.account !== UsersTypes.admin)
      throw new CustomError(
        ErrorEnum[403],
        "Invalid User",
        ErrorCodes.FORBIDDEN,
      );
  }

  public async FetchActiveQuotes(): Promise<QuoteType[]> {
    return await quoteRepository.fetchActiveQuotes();
  }
}

export default new QuoteAdminService();
