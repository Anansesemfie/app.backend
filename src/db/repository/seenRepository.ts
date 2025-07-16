import { Seen } from "../models";
import type { SeenType } from "../../dto";
import HELPERS from "../../utils/helpers";

class SeenRepository {
  public async create(seen: SeenType): Promise<SeenType> {
    return await Seen.create(seen);
  }
  public async fetch(bookId: string): Promise<SeenType[]> {
    const seens = await Seen.find({ bookId: bookId });
    return seens;
  }

  public async fetchOne(
    bookId: string,
    userId = "",
    period: string
  ): Promise<SeenType> {
    const seen = await Seen.findOne({ bookID: bookId, user: userId, period });
    return seen;
  }

  public async findAll(bookID: string, params = {}): Promise<SeenType[]> {
    const seen = await Seen.find({
      bookID,
      ...params,
    });
    return seen;
  }

  public async update(id: string, payload: object): Promise<SeenType> {
    const updatedSeen = await Seen.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    });
    if (!updatedSeen) {
      throw new Error("Seen not found or update failed");
    }
    return updatedSeen;
  }
}

export default new SeenRepository();
