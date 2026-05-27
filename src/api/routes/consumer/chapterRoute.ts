import { Router } from "express";
import {
  getChapters,
  getChapter,
} from "../../../controllers/chapterController";

import { REQUIREAUTH } from "../../middlewares/CheckApp";

const router = Router();

router.get("/all/:bookId", REQUIREAUTH, getChapters);
router.get("/:chapterId", REQUIREAUTH, getChapter);

export default router;
