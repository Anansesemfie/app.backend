import { Seen } from "../models";
import { SeenType } from "../../dto";

class SeenRepository {
  public async create(seen: SeenType): Promise<SeenType> {
    try {
      return await Seen.create(seen);
    } catch (error: any) {
      throw error;
    }
  }
  public async fetch(bookId: string): Promise<SeenType[]> {
    try {
      const seens = await Seen.find({ bookId: bookId });
      return seens;
    } catch (error: unknown) {
      throw error;
    }
  }

  public async fetchOne(
    bookId: string,
    userId: string = ""
  ): Promise<SeenType> {
    try {
      const seen = await Seen.findOne({ bookID: bookId, user: userId });
      return seen;
    } catch (error: unknown) {
      throw error;
    }
  }

  public async findAll(bookID: string, params?: {}): Promise<SeenType[]> {
    try {
      const seen = await Seen.find({
        bookID,
        ...params,
      });
      return seen;
    } catch (error: unknown) {
      throw error;
    }
  }

  public async update(params: {}, payload: {}): Promise<SeenType> {
    try {
      const updatedSeen = await Seen.findOneAndUpdate(params, payload);
      return updatedSeen;
    } catch (error: unknown) {
      throw error;
    }
  }
}

export default new SeenRepository();
