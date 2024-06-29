import { Router } from "express";
import {
  CreateUser,
  LoginUser,
  resendVerification,
  verifyEmail
} from "../../../controllers/admin/userController";

const router = Router();

router.post("/add", CreateUser);
router.post('/resend-verification-email', resendVerification);
router.get('/verify', verifyEmail)
router.post("/login", LoginUser);

export default router;
