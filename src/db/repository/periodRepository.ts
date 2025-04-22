import { Periods } from "../models";
import type { PeriodType, PeriodResponseType } from "../../dto";
import errHandler, { ErrorEnum } from "../../utils/error";

class PeriodRepository {
  public async create(period: PeriodType): Promise<PeriodType> {
    try {
      return await Periods.create(period);
    } catch (error: unknown) {
      throw await errHandler.CustomError(ErrorEnum[400], error._message);
    }
  }
  public async fetchOne(periodId: string): Promise<PeriodType> {
    try {
      const fetchedPeriod = await Periods.findOne({
        _id: periodId,
      });
      return fetchedPeriod;
    } catch (error: unknown) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error fetching period"
      );
    }
  }
  public async fetchLatest(): Promise<PeriodType> {
    try {
      const fetchedPeriod = await Periods.findOne().sort({ createdAt: -1 });
      return fetchedPeriod;
    } catch (error: unknown) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error fetching latest period"
      );
    }
  }
  public async update(
    periodId: string,
    period: Partial<PeriodType>
  ): Promise<PeriodType> {
    try {
      const updatedPeriod = await Periods.findOneAndUpdate(
        { _id: periodId },
        period,
        { new: true }
      );
      return updatedPeriod;
    } catch (error: unknown) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error updating period"
      );
    }
  }
  public async fetchAll(): Promise<PeriodType[]> {
    try {
      const fetchedPeriods = await Periods.find();
      return fetchedPeriods;
    } catch (error: unknown) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error fetching periods"
      );
    }
  }
  public async delete(periodId: string): Promise<void> {
    try {
      await Periods.findByIdAndDelete(periodId);
    } catch (error: unknown) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error deleting period"
      );
    }
  }
}
export default new PeriodRepository();
