import HELPERS from "../utils/helpers";
import seenRepository from "../db/repository/seenRepository";
import periodService from "./periodService";
import type { SeenType } from "../dto";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import { ErrorEnum } from "../utils/error";

class SeenService {
  private logInfo = "";
  async createNewSeen(bookId: string, userId: string): Promise<SeenType> {
    if (!bookId || !userId) {
      throw new CustomError(
        ErrorEnum[400],
        "Book ID and User ID are required to create a seen.",
        ErrorCodes.BAD_REQUEST
      );
    }
    const period = await periodService.fetchLatest();
    if (!period) {
      throw new CustomError(
        ErrorEnum[404],
        "No active period found.",
        ErrorCodes.NOT_FOUND
      );
    }
    const oldSeen = await this.fetchSeen(userId, bookId, period._id ?? "");

    const newSeen: SeenType = {
      user: userId,
      bookID: bookId,
      period: period._id ?? "",
    };
    if (oldSeen) {
      return this.updateSeen(oldSeen._id ?? "", newSeen);
    }
    const seen = await seenRepository.create(newSeen);
    return seen;
  }
  async updateSeen(id: string, payload: object): Promise<SeenType> {
    if (!id) {
      throw new CustomError(
        ErrorEnum[400],
        "Book ID and User ID are required to update a seen.",
        ErrorCodes.BAD_REQUEST
      );
    }
    const updatedSeen = await seenRepository.update(id, payload);
    return updatedSeen;
  }

  async fetchSeen(id: string, book: string, period: string): Promise<SeenType> {
    if (!id || !period) {
      throw new CustomError(
        ErrorEnum[400],
        "Missing required details.",
        ErrorCodes.BAD_REQUEST
      );
    }

    const seen = await seenRepository.fetchOne( book,id, period);

    return seen;
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

    const period = await periodService.fetchLatest();
    let seen = await seenRepository.fetchOne(bookId, userId, period?._id ?? "");
    if (!seen) {
      seen = await this.createNewSeen(bookId, userId);
    }
    seen.playedAt?.push(playedAt || HELPERS.currentTime());

    const newSeen = await this.updateSeen(seen._id ?? "", {
      playedAt: seen.playedAt,
      subscription,
    });

    return;
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
    const data = await seenRepository.findAll(bookId, {
      period: periodId,
    });
    HELPERS.LOG((data.filter((item) => Number(item.playedAt?.length) > 0)).length)
    const seen = data.filter((item) => item.seenAt);
    const played = data.filter((item) => Number(item.playedAt?.length) > 0);
    return { seen: seen.length, played: played.length };
  }
}

export default new SeenService();
