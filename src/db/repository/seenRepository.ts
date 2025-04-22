import { Seen } from "../models";
import type { SeenType } from "../../dto";

class SeenRepository {
  public async create(seen: SeenType): Promise<SeenType> {
    return await Seen.create(seen);
  }
  public async fetch(bookId: string): Promise<SeenType[]> {
    const seens = await Seen.find({ bookId: bookId });
    return seens;
  }

  public async fetchOne(bookId: string, userId = ""): Promise<SeenType> {
    const seen = await Seen.findOne({ bookID: bookId, user: userId });
    return seen;
  }

  public async findAll(bookID: string, params = {}): Promise<SeenType[]> {
    const seen = await Seen.find({
      bookID,
      ...params,
    });
    return seen;
  }

  public async update(
    params: { bookID: string; user: string; periodId: string },
    payload: object
  ): Promise<SeenType> {
    const updatedSeen = await Seen.findOneAndUpdate(params, payload, {
      new: true,
    });
    return updatedSeen;
  }
}

export default new SeenRepository();
