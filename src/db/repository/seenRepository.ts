import { Seen } from "../models";
import { seenDTO } from "../../dto";

class SeenRepository {
  public async create(seen: seenDTO): Promise<seenDTO> {
    try {
      return await Seen.create(seen);
    } catch (error: any) {
      throw new Error(error);
    }
  }
  public async fetch(bookId: string): Promise<seenDTO[]> {
    try {
      const seens = await Seen.find({ bookId: bookId });
      return seens;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async fetchOne(bookId: string, userId: string = ""): Promise<seenDTO> {
    try {
      const seen = await Seen.findOne({ bookId: bookId, user: userId });
      return seen;
    } catch (error: any) {
      throw new Error(error);
    }
  }

  public async update(params: {}, payload: {}): Promise<seenDTO> {
    try {
      const updatedSeen = await Seen.findOneAndUpdate(params, payload);
      return updatedSeen;
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

export default new SeenRepository();