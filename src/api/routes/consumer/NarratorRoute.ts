import { Router } from "express";
import { getNarrators, getNarrator } from "../../../controllers/narratorController";

const router = Router();

router.get("/", getNarrators);
router.get("/:id", getNarrator);

export default router;
