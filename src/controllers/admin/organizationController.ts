import orgService from "../../services/organizationService";
import { Request, Response } from "express";
import CustomError, { CustomErrorHandler } from "../../utils/CustomError";

/**
 * Controller for handling organization-related create request.
 * @param {Request} req - The request object containing organization data.
 * @param {Response} res - The response object to send the result.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export const CreateOrg = async (req: Request, res: Response) => {
  try {
    const organization = await orgService.create(req.body);
    res.status(201).json({
      status: "success",
      data: organization,
    });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
export const FetchOrg = async (req: Request, res: Response) => {
  try {
    const organization = await orgService.fetchOne(req.params.id);
    res.status(200).json({
      status: "success",
      data: organization,
    });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
export const UpdateOrg = async (req: Request, res: Response) => {
  try {
    const organization = await orgService.update(req.params.id, req.body);
    res.status(200).json({
      status: "success",
      data: organization,
    });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
export const FetchAllOrgs = async (req: Request, res: Response) => {
  try {
    const organizations = await orgService.fetchAll();
    res.status(200).json({
      status: "success",
      data: organizations,
    });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
