import HELPERS from "../utils/helpers";
import seenRepository from "../db/repository/seenRepository";
import { SeenType } from "../dto";
import errorHandler, { ErrorEnum } from "../utils/error";

class SeenService {
  private logInfo = "";
  
  async createNewSeen(bookId: string, userId: string): Promise<SeenType> {
    try {
      const oldSeen = await seenRepository.fetchOne(bookId, userId);
      if (oldSeen) return oldSeen;
      const newSeen: SeenType = {
        user: userId,
        bookId: bookId,
      };
      const seen = await seenRepository.create(newSeen);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } creating new seen @ ${HELPERS.currentTime()}`;
      return seen;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } fetching books @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

  async updateSeen(
    bookId: string,
    userId: string,
    params: {}
  ): Promise<SeenType> {
    try {
      const updatedSeen = await seenRepository.update(
        { bookId: bookId, user: userId },
        params
      );
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } updating seen @ ${HELPERS.currentTime()}`;
      return updatedSeen;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } updating seen @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }

 public async getBookSeenByBookId(bookId: string) {
    try{
      if (!bookId)
        throw await errorHandler.CustomError(ErrorEnum[403], "Invalid book ID");
      const seens = await seenRepository.fetch(bookId);
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } fetching seen by bookid: ${bookId} @ ${HELPERS.currentTime()}`;
      return seens;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } fetching seen by bookid: ${bookId} @ ${HELPERS.currentTime()}`;
      throw error;
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
}

export default new SeenService();
