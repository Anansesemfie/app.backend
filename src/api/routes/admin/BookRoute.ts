import {
  CreateBook,
  GenerateSignedUrl,
  UpdateBook,
  CreateChapter,
  GetBookAnalysis,
  DeleteChapter,
  DeleteBook,
  UpdateChapter,
} from "../../../controllers/admin/bookController";
import { Router } from "express";

const router = Router();

router.get("/metrics/:bookId", GetBookAnalysis);

router.post("/getSignedUrl", GenerateSignedUrl);
router.post("/createBook", CreateBook);
router.post("/createChapter", CreateChapter);
router.delete("/deleteChapter/:id", DeleteChapter);
router.delete("/deleteBook/:id", DeleteBook);
router.put("/updateBook/:id", UpdateBook);
router.put("/updateChapter/:id", UpdateChapter);

export default router;
