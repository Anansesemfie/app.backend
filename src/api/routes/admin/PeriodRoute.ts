import {
  CreatePeriod,
  FetchPeriod,
  FetchLatestPeriod,
  FetchAllPeriods,
  UpdatePeriod,
  DeactivatePeriod,
} from "../../../controllers/admin/periodController";

import { Router } from "express";
const router = Router();

router.post("/create", CreatePeriod);
router.get("/single/:id", FetchPeriod);
router.put("/:id", UpdatePeriod);
router.get("/", FetchLatestPeriod);
router.get("/all", FetchAllPeriods);
router.put("/:id", DeactivatePeriod);

export default router;
