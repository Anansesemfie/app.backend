import {
  GetSettings,
  UpdateSettings,
} from "../../../controllers/admin/appConfigController";
import { Router } from "express";

const router = Router();

router.get("/", GetSettings);
router.put("/", UpdateSettings);

export default router;
