import Period from "../../services/periodService";
import { Request, Response } from "express";
import CustomError, { CustomErrorHandler } from "../../utils/CustomError";

export const CreatePeriod = async (req: Request, res: Response) => {
  try {
    const period = req.body;
    const createdPeriod = await Period.create(period);
    res.status(200).json({ data: createdPeriod });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const UpdatePeriod = async (req: Request, res: Response) => {
  try {
    const periodId = req.params.id;
    const period = req.body;
    const updatedPeriod = await Period.update(periodId, period);
    res.status(200).json({ data: updatedPeriod });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const FetchPeriod = async (req: Request, res: Response) => {
  try {
    const periodId = req.params.id;
    const fetchedPeriod = await Period.fetchOne(periodId);
    res.status(200).json({ data: fetchedPeriod });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
export const FetchLatestPeriod = async (req: Request, res: Response) => {
  try {
    const latestPeriod = await Period.fetchLatest();
    res.status(200).json({ data: latestPeriod });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
export const FetchAllPeriods = async (req: Request, res: Response) => {
  try {
    const periods = await Period.fetchAll();
    res.status(200).json({ data: periods });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const DeactivatePeriod = async (req: Request, res: Response) => {
  try {
    const periodId = req.params.id;
    const deactivatedPeriod = await Period.deactivate(periodId);
    res.status(200).json({ data: deactivatedPeriod });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
