import { Play } from "../../../controllers/playController";
import { Router } from "express";
import { REQUIREAUTH } from "../../middlewares/CheckApp";

const router = Router();

router.get("/:chapter", REQUIREAUTH, Play);

export default router;
