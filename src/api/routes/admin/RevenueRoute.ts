import { Router } from "express";
import { GetSummary } from "../../../controllers/admin/revenueController";

const router = Router();

router.get("/summary", GetSummary);

export default router;
