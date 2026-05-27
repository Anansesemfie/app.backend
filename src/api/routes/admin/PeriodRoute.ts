import { Router } from "express";

import {
  CreatePeriod,
  DeactivatePeriod,
  FetchAllPeriods,
  FetchLatestPeriod,
  FetchPeriod,
  UpdatePeriod,
} from "../../../controllers/admin/periodController";
const router = Router();

router.post("/create", CreatePeriod);
router.get("/single/:id", FetchPeriod);
router.put("/:id", UpdatePeriod);
router.put("/:id/deactivate", DeactivatePeriod);
router.get("/", FetchLatestPeriod);
router.get("/all", FetchAllPeriods);

export default router;
