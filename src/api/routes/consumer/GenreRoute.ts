import { getGenres, getGenre } from "../../../controllers/genreController";
import { Router } from "express";

const router = Router();

router.get("/", getGenres);
router.get("/:id", getGenre);

export default router;
