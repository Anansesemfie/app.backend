import {
  CreateBook,
  GenerateSignedUrl,
  UpdateBook,
  CreateChapter,
} from "../../../controllers/admin/bookController";
import { Router } from "express";

const router = Router();

router.post("/getSignedUrl", GenerateSignedUrl);
router.post("/createBook", CreateBook);
router.post("/createChapter", CreateChapter);

router.put("/updateBook", UpdateBook);

export default router;
