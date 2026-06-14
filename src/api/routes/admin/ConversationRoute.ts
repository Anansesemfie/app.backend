import { Router } from "express";
import {
  GetComments,
  DeleteComment,
  GetReports,
  UpdateReportStatus,
} from "../../../controllers/admin/conversationController";

const router = Router();

router.get("/comments", GetComments);
router.delete("/comments/:id", DeleteComment);

router.get("/reports", GetReports);
router.patch("/reports/:id", UpdateReportStatus);

export default router;
