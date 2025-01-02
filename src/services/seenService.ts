import HELPERS from "../utils/helpers";
import seenRepository from "../db/repository/seenRepository";
import { SeenType } from "../dto";

class SeenService {
  private logInfo = "";
  async createNewSeen(bookId: string, userId: string): Promise<SeenType> {
    try {
      const oldSeen = await seenRepository.fetchOne(bookId, userId);
      if (oldSeen) return oldSeen;
      const newSeen: SeenType = {
        user: userId,
        bookID: bookId,
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

  async getSeensAndPlay(
    bookId: string,
    start: string,
    end: string
  ): Promise<{ seen: number; played: number }> {
    try {
      const seen = await seenRepository.findAll(bookId, {
        seenAt: { $gte: new Date(start), $lt: new Date(end) },
      });
      const played = await seenRepository.findAll(bookId, {
        playedAt: { $gte: new Date(start), $lt: new Date(end) },
      });
      return { seen: seen.length, played: played.length };
    } catch (error: unknown) {
      this.logInfo = `${
        HELPERS.loggerInfo.error
      } fetching seen and played @ ${HELPERS.currentTime()}`;
      await HELPERS.logger(this.logInfo);
      this.logInfo = "";
      return { seen: 0, played: 0 };
    }
  }
}

export default new SeenService();
