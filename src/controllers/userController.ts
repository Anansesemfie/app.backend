import userService from "../services/userService";
import { Request, Response } from "express";

export const CreateUser = async (req: Request, res: Response) => {
  try {
    let user = req.body;
    const newUser = await userService.create(user);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const LoginUser = async (req: Request, res: Response) => {
  try {
    if (res.locals.hasToken)
      res.status(401).json({ message: "Already logged in" });
    let user = req?.body;
    const fetchedUser = await userService.login(user);
    res.status(200).json(fetchedUser);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const LogoutUser = async (req: Request, res: Response) => {
  try {
    if (!res.locals.hasToken) throw new Error("User not logged in");
    const sessionId = res?.locals?.session;
    const fetchedUser = await userService.logout(sessionId);
    res.status(200).json(fetchedUser);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const resetPassword = async(req:Request, res:Response)=>{
  try {
    const { token, newPassword } = req.body;
    await userService.resetPassword(token, newPassword);
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error:any) {
    res.status(500).json({message: error.message});
  }
}

export const forgotPassword = async(req:Request, res:Response)=>{
  try {
    const {email} = req.body;
    await userService.requestPasswordReset(email);
    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error:any) {
    res.status(500).json({message: error.message});
  }
}