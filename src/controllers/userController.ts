import userService from "../services/userService";
import { Request, Response } from "express";

export const CreateUser = async (req: Request, res: Response) => {
  try {
    let user = req.body;
    const newUser = await userService.create(user);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const LoginUser = async (req: Request, res: Response) => {
  try {
    let user = req?.body;
    const fetchedUser = await userService.login(user);
    res.status(200).json(fetchedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const GetAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
