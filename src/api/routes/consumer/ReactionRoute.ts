import { likeBook, dislikeBook } from "../../../controllers/reactionController";
import {
  postComment,
  getComments,
} from "../../../controllers/commentController";
import { Router } from "express";

const router = Router();

router.post("/like/:bookId", likeBook);
router.post("/dislike/:bookId", dislikeBook);
router.post("/comment", postComment);
router.get("/comment/:bookId", getComments);

export default router;
