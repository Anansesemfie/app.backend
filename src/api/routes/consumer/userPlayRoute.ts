import { Play } from "../../../controllers/playController";
import { Router } from "express";

const router = Router();

router.get("/:chapter", Play);

export default router;
