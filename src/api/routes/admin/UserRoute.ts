import { Router } from "express";
import {
  CreateUser,
  LoginUser,
} from "../../../controllers/admin/userController";

const router = Router();

router.post("/add", CreateUser);
router.post("/login", LoginUser);

export default router;
