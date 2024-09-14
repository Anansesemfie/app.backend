import {
  CreateBook,
  GenerateSignedUrl,
  UpdateBook,
} from "../../../controllers/admin/bookController";
import { Router } from "express";

const router = Router();

router.post("/getSignedUrl", GenerateSignedUrl);
router.post("/createBook", CreateBook);
router.put("/updateBook", UpdateBook);

export default router;
