import { Router } from "express";
import {
  CreateUser,
  LoginUser,
  SendEmail
} from "../../../controllers/admin/userController";

const router = Router();

router.post("/add", CreateUser);
router.post("/login", LoginUser);
router.post("/send-email", SendEmail);

export default router;
