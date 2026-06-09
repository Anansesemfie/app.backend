import { Router, Request, Response } from "express";
import { PORT } from "../../../utils/env";
import { CHECKAPPTOKEN } from "../../middlewares/CheckApp";

import User from "./UserRoute";
import Book from "./BookRoute";
import Author from "./AuthorRoute";
import Narrator from "./NarratorRoute";
import Play from "./userPlayRoute";
import Subscriptions from "./SubscriptionRoute";
import WHCB from "./webHookCallBacks";
import Quote from "./QuoteRoute";

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

router.use("/user", User);
router.use("/whcb", WHCB);
router.use("/book/", CHECKAPPTOKEN, Book);
router.use("/author", CHECKAPPTOKEN, Author);
router.use("/narrator", CHECKAPPTOKEN, Narrator);
router.use("/chapter/play", CHECKAPPTOKEN, Play);
router.use("/subscription", Subscriptions);
router.use("/quotes", Quote);

export default router;
