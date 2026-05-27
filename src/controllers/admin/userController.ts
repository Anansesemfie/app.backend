import userService from "../../services/admin/userService";
import consumerUserService from "../../services/userService";
import emailService from "../../services/emailService";
import userRepository from "../../db/repository/userRepository";
import { Request, Response } from "express";
import { UsersTypes } from "../../db/models/utils";
import CustomError, { CustomErrorHandler, ErrorCodes } from "../../utils/CustomError";
import { ErrorEnum } from "../../utils/error";
export const CreateUser = async (req: Request, res: Response) => {
  try {
    let user = req.body;
    let sessionId = res.locals.sessionId;
    const newUser = await userService.create(user, sessionId);
    res.status(201).json({ data: newUser });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const LoginUser = async (req: Request, res: Response) => {
  try {
    if (res.locals.sessionId)
      res.status(401).json({ message: "Already logged in" });
    let user = req?.body;
    const fetchedUser = await userService.login(user);
    res.status(200).json({ data: fetchedUser });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const SendEmail = async (req: Request, res: Response) => {
  try {
    let { email, body } = req.body;
    const emailSent = await emailService.sendEmail(email, body);
    res.status(200).json({ data: emailSent });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const FetchUsers = async (req: Request, res: Response) => {
  try {
    const { search, account } = req.body;
    const sessionId = res.locals.sessionId;
    const users = await userService.fetchUsers({ search, account }, sessionId);
    res.status(200).json({ data: users });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
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
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};

export const FetchUser = async (req: Request, res: Response) => {
  try {
    const sessionId = res.locals.sessionId;
    const { user: sessionUser } = await (await import("../../services/sessionService")).default.getSession(sessionId);
    if (!sessionUser || sessionUser.account !== UsersTypes.admin) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const userId = req.params.id;
    const user = await userRepository.fetchUser(userId);
    if (!user) {
      throw new CustomError("User not found", "User not found", ErrorCodes.NOT_FOUND);
    }
    const formatted = await consumerUserService.formatUser(user);
    res.status(200).json({ data: formatted });
  } catch (error) {
    CustomErrorHandler.handle(error, res);
  }
};
