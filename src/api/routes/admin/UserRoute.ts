import { Router } from "express";
import {
  CreateUser,
  FetchUsers,
  LoginUser,
  MakeAssociate,
  SendEmail,
} from "../../../controllers/admin/userController";
import { CHECKAPPTOKEN } from "../../../api/middlewares/CheckApp";

const router = Router();

router.post("/add", CHECKAPPTOKEN, CreateUser);
router.post("/login", LoginUser);
router.post("/sendEmail", CHECKAPPTOKEN, SendEmail);

router.post("/fetchUsers", CHECKAPPTOKEN, FetchUsers);

router.put("/makeAssociate", CHECKAPPTOKEN, MakeAssociate);

export default router;
