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
} from "../../../controllers/userController";

const router = Router();

router.get("/logout/", CHECKAPPTOKEN, LogoutUser);

router.post("/add", CreateUser);
router.post("/login", LoginUser);

router.post("/forgot-password", forgotPassword);
router.post("/subscribe", CHECKAPPTOKEN, createSubscription);

router.put("/subscribe/link", CHECKAPPTOKEN, linkSubscription);
router.put("/reset-password", resetPassword);

export default router;
