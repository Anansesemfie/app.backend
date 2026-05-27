import { Router } from "express";
import rateLimit from "express-rate-limit";
import { CHECKAPPTOKEN, REQUIREAUTH } from "../../middlewares/CheckApp";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { code: "TOO_MANY_REQUESTS", message: "Too many attempts, please try again later", status: 429 },
});
import {
  CreateUser,
  LoginUser,
  LogoutUser,
  resetPassword,
  forgotPassword,
  createSubscription,
  linkSubscription,
  verifyAccount,
  getProfile,
  updateProfile,
} from "../../../controllers/userController";

const router = Router();

router.get("/logout/", REQUIREAUTH, LogoutUser);
router.get("/profile", REQUIREAUTH, getProfile);
router.get("/verify/:token", verifyAccount);

router.post("/add", authLimiter, CreateUser);
router.post("/login", authLimiter, LoginUser);

router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/subscribe", REQUIREAUTH, createSubscription);

router.patch("/profile", REQUIREAUTH, updateProfile);
router.put("/subscribe/link", REQUIREAUTH, linkSubscription);
router.put("/reset-password", resetPassword);
router.put("/forgot-password", forgotPassword);

export default router;
