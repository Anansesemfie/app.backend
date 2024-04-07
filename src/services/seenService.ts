import HELPERS from "../utils/helpers";
import seenRepository from "../db/repository/seenRepository";
import { seenDTO } from "../dto";

class SeenService {
  private logInfo = "";
  async createNewSeen(bookId: string, userId: string): Promise<seenDTO> {
    try {
      const oldSeen = await seenRepository.fetchOne(bookId, userId);
      if (oldSeen) return oldSeen;

      const seen = await seenRepository.create({ bookId, user: userId });
      this.logInfo = `${
        HELPERS.loggerInfo.success
      } creating new seen @ ${HELPERS.currentTime()}`;
      return seen;
    } catch (error: any) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } fetching books @ ${HELPERS.currentTime()}`;
      throw new Error(error);
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
  async updateSeen(
    bookId: string,
    userId: string,
    params: {}
  ): Promise<seenDTO> {
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
      throw new Error(error);
    } finally {
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
    }
  }
}

export default new SeenService();
