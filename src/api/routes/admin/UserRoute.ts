import { Router } from "express";
import {
  CreateUser,
  LoginUser,
  SendEmail,
} from "../../../controllers/admin/userController";
import { CHECKAPPTOKEN } from "../../../api/middlewares/CheckApp";

const router = Router();

router.post("/add", CHECKAPPTOKEN, CreateUser);
router.post("/login", LoginUser);
router.post("/send-email", CHECKAPPTOKEN, SendEmail);

export default router;
