import { Router } from "express";
import { CHECKAPPTOKEN } from "../../middlewares/CheckApp";
import {
  CreateUser,
  LoginUser,
  LogoutUser,
  resetPassword,
  forgotPassword,
} from "../../../controllers/userController";

const router = Router();

router.post("/add", CreateUser);
router.post("/login", LoginUser);
router.get("/logout/",CHECKAPPTOKEN, LogoutUser);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);

export default router;
