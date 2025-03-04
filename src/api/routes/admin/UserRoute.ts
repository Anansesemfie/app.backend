import { Router } from "express";
import {
  CreateUser,
  FetchUsers,
  LoginUser,
  SendEmail,
} from "../../../controllers/admin/userController";
import { CHECKAPPTOKEN } from "../../../api/middlewares/CheckApp";

const router = Router();

router.post("/add", CHECKAPPTOKEN, CreateUser);
router.post("/login", LoginUser);
router.post("/send-email", CHECKAPPTOKEN, SendEmail);

router.post("/fetchusers", CHECKAPPTOKEN, FetchUsers);

export default router;
