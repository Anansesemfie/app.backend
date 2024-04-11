import userService from "../services/userService";
import { Request, Response } from "express";

import errorHandler from "../utils/error";
export const CreateUser = async (req: Request, res: Response) => {
  try {
    let user = req.body;
    const newUser = await userService.create(user);
    res.status(201).json(newUser);
  } catch (error: any) {
    console.log(error);
    
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.errorCode,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const LoginUser = async (req: Request, res: Response) => {
  try {
    if (res.locals.sessionId)
      res.status(401).json({ message: "Already logged in" });
    let user = req?.body;
    const fetchedUser = await userService.login(user);
    res.status(200).json(fetchedUser);
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.errorCode,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const LogoutUser = async (req: Request, res: Response) => {
  try {
    const sessionId = res.locals.sessionId;
    if (!sessionId) throw new Error("User not logged in");
    const fetchedUser = await userService.logout(sessionId);
    res.status(200).json(fetchedUser);
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.errorCode,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    await userService.resetPassword(token, newPassword);
    res.status(200).json({ message: "Password reset successful" });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.errorCode,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await userService.requestPasswordReset(email);
    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.errorCode,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};