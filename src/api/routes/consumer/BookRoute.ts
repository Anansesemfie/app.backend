import { Router } from "express";
import {
  getBook,
  getBooks,
  filterBooks,
  getLikedBooksByUser,
  getBookStats,
} from "../../../controllers/bookController";
import { REQUIREAUTH } from "../../middlewares/CheckApp";
import Languages from "./LanguageRoute";
import Chapter from "./chapterRoute";

import Reaction from "./ReactionRoute";
import Category from "./CategoryRoute";
import Genre from "./GenreRoute";
import Comment from "./CommentRoute";

const router = Router();

router.use("/languages", Languages);
router.use("/chapter", Chapter);
router.use("/reaction", Reaction);
router.use("/category", Category);
router.use("/genre", Genre);
router.use("/comment", Comment);

router.get("/", getBooks);
router.get("/:bookId/stats", getBookStats);
router.get("/:bookId", getBook);
router.get("/filter/all", filterBooks);
router.get("/liked/all", REQUIREAUTH, getLikedBooksByUser);

export default router;
