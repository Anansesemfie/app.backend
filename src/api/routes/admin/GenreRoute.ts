import { Router } from "express";
import {
  createGenre,
  updateGenre,
  deleteGenre,
  getAllGenres,
  getGenre,
  toggleGenreActive,
} from "../../../controllers/admin/genreController";

const router = Router();

router.post("/create", createGenre);
router.get("/all", getAllGenres);
router.get("/:id", getGenre);
router.put("/:id", updateGenre);
router.delete("/:id", deleteGenre);
router.patch("/:id/toggle", toggleGenreActive);

export default router;
