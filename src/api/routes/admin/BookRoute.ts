import {
  CreateBook,
  GenerateSignedUrl,
  UpdateBook,
  BookAnalytics,
} from "../../../controllers/admin/bookController";
import { Router } from "express";

const router = Router();

router.post("/getSignedUrl", GenerateSignedUrl);
router.get("/bookAnalytics/:bookId", BookAnalytics);
router.post("/createBook", CreateBook);
router.put("/updateBook", UpdateBook);

export default router;
