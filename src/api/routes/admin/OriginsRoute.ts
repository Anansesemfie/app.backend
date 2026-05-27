import { Router } from "express";
import {
  CreateOrigin,
  GetOrigin,
  ListOrigins,
  ToggleOriginActive,
  UpdateOrigin,
} from "../../../controllers/admin/originsController";

const router = Router();

router.get("/all", ListOrigins);
router.get("/:id", GetOrigin);
router.post("/create", CreateOrigin);
router.put("/:id", UpdateOrigin);
router.patch("/:id/toggle", ToggleOriginActive);

export default router;
