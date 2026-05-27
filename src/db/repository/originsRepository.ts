import { Origin } from "../models";
import type { OriginType } from "../../dto";

class OriginsRepository {
  async create(data: OriginType): Promise<OriginType> {
    return await Origin.create(data);
  }

  async findAll(): Promise<OriginType[]> {
    return await Origin.find({});
  }

  async findById(id: string): Promise<OriginType | null> {
    return await Origin.findById(id);
  }

  async update(id: string, data: Partial<OriginType>): Promise<OriginType | null> {
    return await Origin.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
  }
}

export default new OriginsRepository();
