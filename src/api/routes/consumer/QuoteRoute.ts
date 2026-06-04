import { Router } from "express";
import { FetchActiveQuotes} from "../../../controllers/admin/quoteController";
const router = Router();

router.get("/", FetchActiveQuotes);

export default router;
