import {createLanguage,getAll} from '../../../controllers/languageController'
import { Router } from "express";
const router = Router();

router.post("/add", createLanguage);
router.get("/all", getAll);

export default router;