import { Router } from "express";
import {
  CreateUser,
  FetchUsers,
  LoginUser,
  MakeAssociate,
  SendEmail,
} from "../../../controllers/admin/userController";
import { REQUIREAUTH } from "../../../api/middlewares/CheckApp";

const router = Router();

router.post("/add", REQUIREAUTH, CreateUser);
router.post("/login", LoginUser);
router.post("/sendEmail", REQUIREAUTH, SendEmail);

router.post("/fetchUsers", REQUIREAUTH, FetchUsers);

router.put("/changeRole", REQUIREAUTH, MakeAssociate);

export default router;
