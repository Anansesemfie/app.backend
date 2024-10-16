import {
  CreateChapter,
  GetSignedUrl,
} from "../../../controllers/admin/chapterController";
import { Router } from "express";

const router = Router();
router.get("/", (req, res) => {
  res.send("Welcome to Anansesemfie Admin Chapter");
});
router.post("/createChapter", CreateChapter);
router.post("/getSignedUrl", GetSignedUrl);

export default router;
