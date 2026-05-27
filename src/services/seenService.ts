import seenRepository from "../db/repository/seenRepository";
import periodService from "./periodService";

import type { PeriodType, SeenType } from "../dto";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import { ErrorEnum } from "../utils/error";
import HELPERS from "../utils/helpers";

class SeenService {
  /**
   * Fetch the current active period or throw NOT_FOUND.
   * Single source of truth used by every public method.
   */
  private async requireActivePeriod(): Promise<PeriodType> {
    const period = await periodService.fetchLatest();
    if (!period) {
      throw new CustomError(
        ErrorEnum[404],
        "No active period found.",
        ErrorCodes.NOT_FOUND
      );
    }
    return period;
  }

  async createNewSeen(bookId: string, userId: string): Promise<SeenType> {
    if (!bookId || !userId) {
      throw new CustomError(
        ErrorEnum[400],
        "Book ID and User ID are required to create a seen.",
        ErrorCodes.BAD_REQUEST
      );
    }
    const period = await this.requireActivePeriod();
    const oldSeen = await this.fetchSeen(userId, bookId, period._id ?? "");

    const newSeen: SeenType = {
      user: userId,
      bookID: bookId,
      period: period._id ?? "",
    };

    if (oldSeen) {
      return this.updateSeen(oldSeen._id ?? "", newSeen);
    }
    return seenRepository.create(newSeen);
  }

  async updateSeen(id: string, payload: object): Promise<SeenType> {
    if (!id) {
      throw new CustomError(
        ErrorEnum[400],
        "Seen ID is required to update a seen.",
        ErrorCodes.BAD_REQUEST
      );
    }
    return seenRepository.update(id, payload);
  }

  async fetchSeen(id: string, book: string, period: string): Promise<SeenType> {
    if (!id || !period) {
      throw new CustomError(
        ErrorEnum[400],
        "Missing required details.",
        ErrorCodes.BAD_REQUEST
      );
    }
    return seenRepository.fetchOne(book, id, period);
  }

  async recordPlay(
    bookId: string,
    userId: string,
    playedAt: string | Date,
    subscription: string
  ): Promise<void> {
    if (!bookId || !userId) {
      throw new CustomError(
        ErrorEnum[400],
        "Book ID and User ID are required to record play.",
        ErrorCodes.BAD_REQUEST
      );
    }

    const period = await this.requireActivePeriod();
    let seen = await seenRepository.fetchOne(bookId, userId, period._id ?? "");
    if (!seen) {
      seen = await this.createNewSeen(bookId, userId);
    }
    seen.playedAt?.push(playedAt || HELPERS.currentTime());

    await this.updateSeen(seen._id ?? "", {
      playedAt: seen.playedAt,
      subscription,
    });
  }

  async getSeensAndPlay(
    bookId: string,
    periodId = ""
  ): Promise<{ seen: number; played: number }> {
    if (!bookId) {
      throw new CustomError(
        ErrorEnum[400],
        "Book ID is required to fetch seen and played counts.",
        ErrorCodes.BAD_REQUEST
      );
    }
    const data = await seenRepository.findAll(bookId, { period: periodId });
    const seen = data.filter((item) => item.seenAt);
    const played = data.filter((item) => Number(item.playedAt?.length) > 0);
    return { seen: seen.length, played: played.length };
  }
}

export default new SeenService();
