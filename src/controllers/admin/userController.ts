import userService from "../../services/admin/userService";
import { NextFunction, Request, RequestHandler, Response } from "express";

import errorHandler from "../../utils/error";
import { verifyToken } from "../../utils/tokenUtils";
export const CreateUser = async (req: Request, res: Response) => {
  try {
    let user = req.body;
    let sessionId = res.locals.sessionId;
    const newUser = await userService.create(user, sessionId);
    res.status(201).json(newUser);
  } catch (error: any) {
    const { code, message, exMessage } = await errorHandler.HandleError(
      error?.errorCode,
      error?.message
    );
    res.status(code).json({ error: message, message: exMessage });
  }
};

export const resendVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    if (!email)
      res.status(404).json({ error: true, message: "Email not found" });



  } catch (error) {

  }
}

// Verify User Email Address
export const verifyEmail: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query as { token: string };
    const decoded = verifyToken(token)
    if (typeof decoded === 'string')
      res.status(400).json({ error: true, message: "Token expired." });

    const email = (decoded as { email: string }).email;

    // NB- I need to create a repo for updating the user(verified)

    // const user = await verifyEmailStatus(email)
    // if (!user)
    // res.status(404).json({ error: false, message: "User not found" });

    res.status(404).json({ error: true, message: "Email verified successfully" });
  } catch (error) {
    return next(error)
  }
}

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
