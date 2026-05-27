import { Origin } from "../models";
import type { OriginType } from "../../dto";

class OriginsRepository {
  async create(data: OriginType): Promise<OriginType> {
    return await Origin.create(data);
  }

  async findAll(): Promise<OriginType[]> {
    return (await Origin.find({}).select("-__v").lean()) as unknown as OriginType[];
  }

  async findById(id: string): Promise<OriginType | null> {
    return (await Origin.findById(id).select("-__v").lean()) as unknown as OriginType | null;
  }

  async update(id: string, data: Partial<OriginType>): Promise<OriginType | null> {
    return (await Origin.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    )
      .select("-__v")
      .lean()) as unknown as OriginType | null;
  }
}

export default new OriginsRepository();
