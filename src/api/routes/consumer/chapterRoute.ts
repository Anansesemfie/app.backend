import { Router } from "express";
import {
  getChapters,
  getChapter,
} from "../../../controllers/chapterController";
const router = Router();

router.get("/:bookId", getChapters);
router.get("/all/:chapterId", getChapter);

export default router;
