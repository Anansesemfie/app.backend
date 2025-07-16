import userService from "../services/userService";
import { Request, Response } from "express";

import CustomError,{ErrorCodes, CustomErrorHandler } from "../utils/CustomError";
import HELPERS from "../utils/helpers";
export const CreateUser = async (req: Request, res: Response) => {
  try {
    let user = req.body;
    const newUser = await userService.create(user);
    res.status(201).json({ data: newUser });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const LoginUser = async (req: Request, res: Response) => {
  try {
    if (res.locals.sessionId){
      throw new CustomError(
       'User is already logged in',
        "User is already logged in",
        ErrorCodes.FORBIDDEN
      );
    }
    let user = req?.body;
    const fetchedUser = await userService.login(user);
    res.status(200).json({ data: fetchedUser });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const LogoutUser = async (req: Request, res: Response) => {
  try {
    const sessionId = res.locals.sessionId;
    HELPERS.LOG("Session ID", sessionId);
    if (!sessionId){
      throw new CustomError(
      "Unknown action",
      "Not Found",
      ErrorCodes.NOT_FOUND
    );
  }
    const fetchedUser = await userService.logout(sessionId);
    res.status(200).json({ data: fetchedUser });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    await userService.resetPassword(token, newPassword);
    res.status(200).json({ data: { message: "Password reset successful" } });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await userService.requestPasswordReset(email);
    res
      .status(200)
      .json({ data: { message: "Password reset email sent successfully" } });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { subscription } = req.body;
    const sessionId = res.locals.sessionId;
    const newSubscription = await userService.createSubscription(
      sessionId,
      subscription
    );
    res.status(201).json({ data: newSubscription });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const linkSubscription = async (req: Request, res: Response) => {
  try {
    const { ref } = req.body;
    const sessionId = res.locals.sessionId;
    const newSubscription = await userService.linkSubscription(sessionId, ref);
    res.status(201).json({ data: newSubscription });
  } catch (error) { CustomErrorHandler.handle(error, res);
  }
};

export const verifyAccount = async (req: Request, res: Response) => {
  try {
    const token = req.params.token as string;
    await userService.verifyAccount(token);
    res
      .status(200)
      .json({ data: { message: "Account verified successfully" } });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
