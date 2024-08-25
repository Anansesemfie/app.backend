import { getAll } from "../../../controllers/languageController";
import { Router } from "express";
const router = Router();

router.get("/", getAll);

export default router;
