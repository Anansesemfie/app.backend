import { Router, Request, Response } from "express";
import { PORT } from "../../../utils/env";
import { CHECKAPPTOKEN } from "../../middlewares/CheckApp";

import User from "./UserRoute";
import Book from "./BookRoute";
import Chapter from "./chapterRoute";
import Play from "./userPlayRoute";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Welcome to Anansesemfie",
    endpoints: {
      staging: `http://localhost:${PORT}/`,
      production: "coming soon....",
    },
    version: "1.0",
  });
});

router.use("/auth", CHECKAPPTOKEN, User);
router.use("/books", CHECKAPPTOKEN, Book);
router.use("/book/chapter", CHECKAPPTOKEN, Chapter);
router.use("/book/chapter/play", CHECKAPPTOKEN, Play);

export default router;
