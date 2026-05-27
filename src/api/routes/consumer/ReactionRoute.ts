import { likeBook, dislikeBook } from "../../../controllers/reactionController";
import {
  postComment,
  getComments,
} from "../../../controllers/commentController";
import { Router } from "express";
import { REQUIREAUTH } from "../../middlewares/CheckApp";

const router = Router();

router.post("/like/:bookId", REQUIREAUTH, likeBook);
router.post("/dislike/:bookId", REQUIREAUTH, dislikeBook);
router.post("/comment", REQUIREAUTH, postComment);
router.get("/comment/:bookId", getComments);

export default router;
