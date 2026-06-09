import { Router } from "express";
import {
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAllAuthors,
  getAuthor,
} from "../../../controllers/admin/authorController";

const router = Router();

router.post("/create", createAuthor);
router.get("/all", getAllAuthors);
router.get("/:id", getAuthor);
router.put("/:id", updateAuthor);
router.delete("/:id", deleteAuthor);

export default router;
