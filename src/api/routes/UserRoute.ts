import { Router } from "express";
import {
  CreateUser,
  LoginUser,
  GetAllUsers,
} from "../../controllers/userController";

const router = Router();

router.post("/add", CreateUser);
router.post("/login", LoginUser);
router.get("/", GetAllUsers);

export default router;
