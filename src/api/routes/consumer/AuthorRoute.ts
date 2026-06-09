import { Router } from "express";
import { getAuthors, getAuthor } from "../../../controllers/authorController";

const router = Router();

router.get("/", getAuthors);
router.get("/:id", getAuthor);

export default router;
