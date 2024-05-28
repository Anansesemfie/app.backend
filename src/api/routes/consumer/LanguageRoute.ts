import {getAll} from '../../../controllers/languageController'
import { Router } from "express";
const router = Router();

router.get("/all", getAll);

export default router;