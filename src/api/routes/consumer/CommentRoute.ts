import { Router } from "express";
import { getComments, postComment } from "../../../controllers/commentController";
const router = Router();

router.get("/:bookId", getComments);
router.post("/add", postComment);

export default router;