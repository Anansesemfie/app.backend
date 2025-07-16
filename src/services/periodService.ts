import periodRepository from "../db/repository/periodRepository";
import type { PeriodType, PeriodResponseType } from "../dto";
import { ErrorEnum } from "../utils/error";
import CustomError, { ErrorCodes } from "../utils/CustomError";
import HELPERS from "../utils/helpers";

class PeriodService {
  public async create(period: PeriodType): Promise<PeriodResponseType> {
    if (!period) {
      period = await this.newPeriod();
    }
    this.checkPayload(period);
    const existingPeriod = await this.fetchLatest();
    if (existingPeriod) {
      await this.deactivate(existingPeriod._id ?? "");
    }
    const createdPeriod = await periodRepository.create(period);
    return this.formatPeriod(createdPeriod);
  }

  public async fetchOne(periodId: string): Promise<PeriodResponseType> {
    const fetchedPeriod = await periodRepository.fetchOne(periodId);
    return await this.formatPeriod(fetchedPeriod);
  }
  public async fetchLatest(): Promise<PeriodType> {
    const fetchedPeriod = await periodRepository.fetchLatest();
    return fetchedPeriod;
  }

  public async update(
    periodId: string,
    period: Partial<PeriodType>
  ): Promise<PeriodResponseType> {
    if (!periodId) {
      throw new CustomError(
        ErrorEnum[400],
        "Period ID is required",
        ErrorCodes.BAD_REQUEST
      );
    }
    const updatedPeriod = await periodRepository.update(periodId, period);
    return await this.formatPeriod(updatedPeriod);
  }

  public async fetchAll(): Promise<PeriodResponseType[]> {
    const fetchedPeriods = await periodRepository.fetchAll();
    return Promise.all(
      fetchedPeriods.map((period) => this.formatPeriod(period))
    );
  }

  public async deactivate(periodId: string): Promise<PeriodResponseType> {
    if (!periodId) {
      throw new CustomError(
        ErrorEnum[400],
        "Period ID is required",
        ErrorCodes.BAD_REQUEST
      );
    }
    const updatedPeriod = await this.update(periodId, {
      active: false,
      endDate: HELPERS.currentTime("YYYY-MM-DD") as Date,
      updatedAt: new Date(),
    });
    return updatedPeriod;
  }

  private async newPeriod(): Promise<PeriodType> {
    const { firstDate, lastDate } = await HELPERS.getFirstAndLastDateOfMonth();
    return {
      startDate: firstDate,
      endDate: lastDate,
      active: true,
      year: firstDate.getFullYear(),
      month: firstDate.getMonth() + 1, // JavaScript months are 0-indexed
    };
  }
  private async checkPayload(period: PeriodType) {
    if (!period.startDate || !period.endDate) {
      throw new CustomError(
        ErrorEnum[400],
        "Period start and end dates are required",
        ErrorCodes.BAD_REQUEST
      );
    }
    if (period.startDate > period.endDate) {
      throw new CustomError(
        ErrorEnum[400],
        "Period start date cannot be after end date",
        ErrorCodes.BAD_REQUEST
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
