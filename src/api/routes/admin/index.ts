import { Router, Request, Response } from "express";
import { PORT } from "../../../utils/env";
import { REQUIREAUTH } from "../../middlewares/CheckApp";

import Language from "./LanguageRoute";
import Author from "./AuthorRoute";
import Narrator from "./NarratorRoute";
import User from "./UserRoute";
import Book from "./BookRoute";
import Genre from "./GenreRoute";
import Period from "./PeriodRoute";
import Org from "./OrgRoute";
import Dashboard from "./DashboardRoute";
import Subscriptions from "./SubscriptionsRoute";
import Conversation from "./ConversationRoute";
import Revenue from "./RevenueRoute";
import AppConfigRoute from "./AppConfigRoute";
import Origins from "./OriginsRoute";
import Quote from "./QuoteRoute";

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

router.use("/language", REQUIREAUTH, Language);
router.use("/author", REQUIREAUTH, Author);
router.use("/narrator", REQUIREAUTH, Narrator);
router.use("/genre", REQUIREAUTH, Genre);
router.use("/user", User);
router.use("/book", REQUIREAUTH, Book);
router.use("/period", REQUIREAUTH, Period);
router.use("/organization", REQUIREAUTH, Org);
router.use("/dashboard", REQUIREAUTH, Dashboard);
router.use("/subscription", REQUIREAUTH, Subscriptions);
router.use("/subscriptions", REQUIREAUTH, Subscriptions);
router.use("/conversation", REQUIREAUTH, Conversation);
router.use("/revenue", REQUIREAUTH, Revenue);
router.use("/settings", REQUIREAUTH, AppConfigRoute);
router.use("/origin", REQUIREAUTH, Origins);
router.use("/quotes", REQUIREAUTH, Quote);

export default router;
