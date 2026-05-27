import { Router } from "express";
import { GetStats, GetPulse } from "../../../controllers/admin/dashboardController";

const router = Router();

router.get("/stats", GetStats);
router.get("/pulse", GetPulse);

export default router;
