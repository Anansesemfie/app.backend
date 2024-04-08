import { Router } from "express";
import {
  CreateUser,
  LoginUser,
  LogoutUser,
} from "../../../controllers/userController";

const router = Router();

router.post("/add", CreateUser);
router.post("/login", LoginUser);

router.get("/logout", LogoutUser);

export default router;
