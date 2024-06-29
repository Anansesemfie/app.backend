import { Router } from "express";
import { getSeen } from "../../../controllers/seenController";
const router = Router();

router.get("/:bookId", getSeen);

export default router;