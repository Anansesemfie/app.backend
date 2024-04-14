import { likeBook, dislikeBook } from "../../../controllers/reactionController";
import { Router } from "express";

const router = Router();

router.post("/like/:bookId", likeBook);
router.post("/dislike/:bookId", dislikeBook);

export default router;
