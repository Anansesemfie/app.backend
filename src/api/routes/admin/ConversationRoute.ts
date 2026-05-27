import { Router } from "express";
import { GetComments, DeleteComment } from "../../../controllers/admin/conversationController";

const router = Router();

router.get("/comments", GetComments);
router.delete("/comments/:id", DeleteComment);

export default router;
