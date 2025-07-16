import { Periods } from "../models";
import type { PeriodType, PeriodResponseType } from "../../dto";
import { ErrorEnum } from "../../utils/error";

class PeriodRepository {
  public async create(period: PeriodType): Promise<PeriodType> {
    return await Periods.create(period);
  }
  public async fetchOne(periodId: string): Promise<PeriodType> {
    const fetchedPeriod = await Periods.findOne({
      _id: periodId,
    });
    return fetchedPeriod;
  }
  public async fetchLatest(): Promise<PeriodType> {
    const fetchedPeriod = await Periods.findOne({ active: true }).sort({
      createdAt: -1,
    });
    return fetchedPeriod;
  }
  public async update(
    periodId: string,
    period: Partial<PeriodType>
  ): Promise<PeriodType> {
    const updatedPeriod = await Periods.findOneAndUpdate(
      { _id: periodId },
      period,
      { new: true }
    );
    return updatedPeriod;
  }
  public async fetchAll(): Promise<PeriodType[]> {
    const fetchedPeriods = await Periods.find().sort({ createdAt: -1 });
    return fetchedPeriods;
  }
  public async delete(periodId: string): Promise<void> {
    await Periods.findByIdAndDelete(periodId);
  }
}
export default new PeriodRepository();
