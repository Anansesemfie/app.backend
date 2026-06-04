import { Router } from "express";
import {
  CreateQuote,
  UpdateQuote,
  DeleteQuote,
  FetchAllQuotes,
  FetchQuote,
} from "../../../controllers/admin/quoteController";

const router = Router();

router.post("/", CreateQuote);
router.get("/", FetchAllQuotes);
router.get("/all", FetchAllQuotes);
router.get("/:id", FetchQuote);
router.patch("/:id", UpdateQuote);
router.delete("/:id", DeleteQuote);

export default router;
