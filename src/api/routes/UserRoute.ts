import { Router } from "express";
import {
  CreateUser,
  LoginUser,
  LogoutUser,
  resetPassword,
  forgotPassword
} from "../../controllers/userController";

const router = Router();

router.post("/add", CreateUser);
router.post("/login", LoginUser);
router.post('/reset-password', resetPassword)
router.post('/forgot-password', forgotPassword)
router.get("/logout", LogoutUser);

export default router;
