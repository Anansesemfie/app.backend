import { getCategories } from "../../../controllers/categoryController";
import { Router } from "express";

const router = Router();

router.get("/", getCategories);

export default router;
