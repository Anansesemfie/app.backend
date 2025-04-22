import periodRepository from "../db/repository/periodRepository";
import type { PeriodType, PeriodResponseType } from "../dto";
import errHandler, { ErrorEnum } from "../utils/error";
import HELPERS from "../utils/helpers";

class PeriodService {
  public async create(period: PeriodType): Promise<PeriodResponseType> {
    try {
      const existingPeriod = await this.fetchLatest();
      if (existingPeriod) {
        await this.deactivate(existingPeriod._id ?? "");
      }
      const createdPeriod = await periodRepository.create(period);
      return this.formatPeriod(createdPeriod);
    } catch (error: unknown) {
      throw await errHandler.CustomError(ErrorEnum[400], error._message);
    }
  }

  public async fetchOne(periodId: string): Promise<PeriodResponseType> {
    try {
      const fetchedPeriod = await periodRepository.fetchOne(periodId);
      return await this.formatPeriod(fetchedPeriod);
    } catch (error: unknown) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error fetching period"
      );
    }
  }
  public async fetchLatest(): Promise<PeriodType> {
    try {
      const fetchedPeriod = await periodRepository.fetchLatest();
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
  ): Promise<PeriodResponseType> {
    try {
      const updatedPeriod = await periodRepository.update(periodId, period);
      return await this.formatPeriod(updatedPeriod);
    } catch (error: unknown) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error updating period"
      );
    }
  }

  public async fetchAll(): Promise<PeriodResponseType[]> {
    try {
      const fetchedPeriods = await periodRepository.fetchAll();
      return Promise.all(
        fetchedPeriods.map((period) => this.formatPeriod(period))
      );
    } catch (error: unknown) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error fetching periods"
      );
    }
  }

  public async deactivate(periodId: string): Promise<PeriodResponseType> {
    try {
      const updatedPeriod = await this.update(periodId, {
        active: false,
        endDate: HELPERS.currentTime("DD/MM/YYYY") as Date,
        updatedAt: new Date(),
      });
      return updatedPeriod;
    } catch (error: unknown) {
      throw await errHandler.CustomError(
        ErrorEnum[400],
        "Error deactivating period"
      );
    }
  }

  public async formatPeriod(period: PeriodType): Promise<PeriodResponseType> {
    return {
      id: period._id ?? "",
      startDate: period.startDate,
      endDate: period.endDate,
      status: period.active ? "active" : "inactive",
      createdAt: period.createdAt ?? new Date(),
      updatedAt: period.updatedAt ?? new Date(),
      year: period.year,
      month: period.month,
    };
  }
}

export default new PeriodService();
