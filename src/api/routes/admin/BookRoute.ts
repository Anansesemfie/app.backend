import { GenerateSignedUrl } from "../../../controllers/admin/bookController";
import { Router } from "express";

const router = Router();

router.post("/getSignedUrl", GenerateSignedUrl);


export default router;