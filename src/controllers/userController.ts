import userService from "../services/userService";
import { Request, Response } from "express";

import errorHandler from "../utils/error";
export const CreateUser = async (req: Request, res: Response) => {
  try {
    let user = req.body;
    const newUser = await userService.create(user);
    res.status(201).json({ data: newUser });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
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
    res.status(200).json({ data: fetchedUser });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
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
    res.status(200).json({ data: fetchedUser });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    await userService.resetPassword(token, newPassword);
    res.status(200).json({ data: { message: "Password reset successful" } });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await userService.requestPasswordReset(email);
    res
      .status(200)
      .json({ data: { message: "Password reset email sent successfully" } });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { subscription } = req.body;
    const sessionId = res.locals.sessionId;
    console.log({ sessionId, subscription });
    const newSubscription = await userService.createSubscription(
      sessionId,
      subscription
    );
    res.status(201).json({ data: newSubscription });
  } catch (error: any) {
    console.log({ error });
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const linkSubscription = async (req: Request, res: Response) => {
  try {
    const { ref } = req.body;
    const sessionId = res.locals.sessionId;
    const newSubscription = await userService.linkSubscription(sessionId, ref);
    res.status(201).json({ data: newSubscription });
  } catch (error: any) {
    console.log({ error });
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const verifyAccount = async (req: Request, res: Response) => {
  try {
    const token = req.query.token as string;
    await userService.verifyAccount(token);
    res
      .status(200)
      .json({ data: { message: "Account verified successfully" } });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};
