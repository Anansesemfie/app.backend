import { Router } from "express";
import { getBook, getBooks } from "../../controllers/bookController";
const router = Router();

router.get("/", getBooks);
router.get("/:bookId", getBook);

export default router;
