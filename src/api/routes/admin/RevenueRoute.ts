import { Router } from "express";
import {
  GetSummary,
  GetBookRevenue,
} from "../../../controllers/admin/revenueController";

const router = Router();

router.get("/summary", GetSummary);
router.get("/:bookId", GetBookRevenue);

export default router;
