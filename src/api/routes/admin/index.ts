import { Router, Request, Response } from "express";
import { PORT } from "../../../utils/env";
import { CHECKAPPTOKEN } from "../../middlewares/CheckApp";

import Language from "./LanguageRoute";
import User from "./UserRoute";
import BookSeens from "./BooksSeenRoute"

const router = Router();

router.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Welcome to Anansesemfie Admin",
    endpoints: {
      staging: `http://localhost:${PORT}/`,
      production: "coming soon....",
    },
    version: "1.0",
  });
});

router.use("/language", CHECKAPPTOKEN, Language);
router.use("/book/seens", CHECKAPPTOKEN, BookSeens);
router.use("/user", CHECKAPPTOKEN, User);
export default router;
