import { Router } from "express";
import {
  getBook,
  getBooks,
  filterBooks,
} from "../../../controllers/bookController";
import Languages from "./LanguageRoute";
import Chapter from "./ChapterRoute";
import Reaction from "./ReactionRoute";
import Category from "./CategoryRoute";
const router = Router();

router.use("/languages", Languages);
router.use("/chapter", Chapter);
router.use("/reaction", Reaction);
router.use("/category", Category);

router.get("/", getBooks);
router.get("/:bookId", getBook);
router.get("/filter/all", filterBooks);

export default router;
