import { Router } from "express";
import {
  createNarrator,
  updateNarrator,
  deleteNarrator,
  getAllNarrators,
  getNarrator,
} from "../../../controllers/admin/narratorController";

const router = Router();

router.post("/create", createNarrator);
router.get("/all", getAllNarrators);
router.get("/:id", getNarrator);
router.put("/:id", updateNarrator);
router.delete("/:id", deleteNarrator);

export default router;
