import { getComments, postComment } from "../../../controllers/commentController";
import { REQUIREAUTH } from "../../middlewares/CheckApp";
import { Router } from "express";

const router = Router();

router.post("/", REQUIREAUTH, postComment);
router.get("/:bookId", getComments);

export default router