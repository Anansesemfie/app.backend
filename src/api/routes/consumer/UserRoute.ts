import { Router } from "express";
import { CHECKAPPTOKEN } from "../../middlewares/CheckApp";
import {
  CreateUser,
  LoginUser,
  LogoutUser,
  resetPassword,
  forgotPassword,
  createSubscription,
  linkSubscription,
  verifyAccount,
} from "../../../controllers/userController";

const router = Router();

router.get("/logout/", CHECKAPPTOKEN, LogoutUser);
router.get("/verify/:token", verifyAccount);

router.post("/add", CreateUser);
router.post("/login", LoginUser);

router.post("/forgot-password", forgotPassword);
router.post("/subscribe", CHECKAPPTOKEN, createSubscription);

router.put("/subscribe/link", CHECKAPPTOKEN, linkSubscription);
router.put("/reset-password", resetPassword);

export default router;
