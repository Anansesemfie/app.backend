import {
  getComments,
  postComment,
  postReply,
  deleteComment,
  reportComment,
} from "../../../controllers/commentController";
import { REQUIREAUTH } from "../../middlewares/CheckApp";
import { Router } from "express";

const router = Router();

router.post("/", REQUIREAUTH, postComment);
router.get("/:bookId", getComments);
router.post("/:commentId/reply", REQUIREAUTH, postReply);
router.post("/:commentId/report", REQUIREAUTH, reportComment);
router.delete("/:commentId", REQUIREAUTH, deleteComment);

export default router;
