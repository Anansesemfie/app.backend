import { Router } from "express";
import {
  getChapters,
  getChapter,
} from "../../../controllers/chapterController";

import { CHECKAPPTOKEN } from "../../middlewares/CheckApp";

const router = Router();

router.get("/all/:bookId", CHECKAPPTOKEN, getChapters);
router.get("/:chapterId", CHECKAPPTOKEN, getChapter);

export default router;
