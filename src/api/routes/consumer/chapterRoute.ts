import { Router } from "express";
import {
  getChapters,
  getChapter,
} from "../../../controllers/chapterController";
const router = Router();

router.get("/all/:bookId", getChapters);
router.get("/:chapterId", getChapter);

export default router;
