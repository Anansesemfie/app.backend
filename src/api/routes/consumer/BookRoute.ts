import { Router } from "express";
import { getBook, getBooks, filterBooks } from "../../../controllers/bookController";
const router = Router();

router.get("", getBooks);
router.get("/:bookId", getBook);
router.get("/filter/all", filterBooks);

export default router;
