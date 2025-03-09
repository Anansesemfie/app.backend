import userService from "../../services/admin/userService";
import emailService from "../../services/emailService";
import { Request, Response } from "express";
import errorHandler from "../../utils/error";
import { UsersTypes } from "../../db/models/utils";
export const CreateUser = async (req: Request, res: Response) => {
  try {
    let user = req.body;
    let sessionId = res.locals.sessionId;
    const newUser = await userService.create(user, sessionId);
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

export const SendEmail = async (req: Request, res: Response) => {
  try {
    let { email, body } = req.body;
    const emailSent = await emailService.sendEmail(email, body);
    res.status(200).json({ data: emailSent });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const FetchUsers = async (req: Request, res: Response) => {
  try {
    const { search, account } = req.body;
    const sessionId = res.locals.sessionId;
    const users = await userService.fetchUsers({ search, account }, sessionId);
    res.status(200).json({ data: users });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const MakeAssociate = async (req: Request, res: Response) => {
  try {
    const { userId, type } = req.body;
    const sessionId = res.locals.sessionId;
    const user = await userService.changeRole(
      userId as string,
      type as UsersTypes,
      sessionId
    );
    res.status(200).json({ data: user });
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.code,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};
