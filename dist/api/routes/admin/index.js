"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const env_1 = require("../../../utils/env");
const CheckApp_1 = require("../../middlewares/CheckApp");
const LanguageRoute_1 = __importDefault(require("./LanguageRoute"));
const AuthorRoute_1 = __importDefault(require("./AuthorRoute"));
const NarratorRoute_1 = __importDefault(require("./NarratorRoute"));
const UserRoute_1 = __importDefault(require("./UserRoute"));
const BookRoute_1 = __importDefault(require("./BookRoute"));
const GenreRoute_1 = __importDefault(require("./GenreRoute"));
const PeriodRoute_1 = __importDefault(require("./PeriodRoute"));
const OrgRoute_1 = __importDefault(require("./OrgRoute"));
const DashboardRoute_1 = __importDefault(require("./DashboardRoute"));
const SubscriptionsRoute_1 = __importDefault(require("./SubscriptionsRoute"));
const ConversationRoute_1 = __importDefault(require("./ConversationRoute"));
const RevenueRoute_1 = __importDefault(require("./RevenueRoute"));
const AppConfigRoute_1 = __importDefault(require("./AppConfigRoute"));
const OriginsRoute_1 = __importDefault(require("./OriginsRoute"));
const QuoteRoute_1 = __importDefault(require("./QuoteRoute"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    return res.status(200).json({
        message: "Welcome to Anansesemfie Admin",
        endpoints: {
            staging: `http://localhost:${env_1.PORT}/`,
            production: "coming soon....",
        },
        version: "1.0",
    });
});
router.use("/language", CheckApp_1.REQUIREAUTH, LanguageRoute_1.default);
router.use("/author", CheckApp_1.REQUIREAUTH, AuthorRoute_1.default);
router.use("/narrator", CheckApp_1.REQUIREAUTH, NarratorRoute_1.default);
router.use("/genre", CheckApp_1.REQUIREAUTH, GenreRoute_1.default);
router.use("/user", UserRoute_1.default);
router.use("/book", CheckApp_1.REQUIREAUTH, BookRoute_1.default);
router.use("/period", CheckApp_1.REQUIREAUTH, PeriodRoute_1.default);
router.use("/organization", CheckApp_1.REQUIREAUTH, OrgRoute_1.default);
router.use("/dashboard", CheckApp_1.REQUIREAUTH, DashboardRoute_1.default);
router.use("/subscription", CheckApp_1.REQUIREAUTH, SubscriptionsRoute_1.default);
router.use("/subscriptions", CheckApp_1.REQUIREAUTH, SubscriptionsRoute_1.default);
router.use("/conversation", CheckApp_1.REQUIREAUTH, ConversationRoute_1.default);
router.use("/revenue", CheckApp_1.REQUIREAUTH, RevenueRoute_1.default);
router.use("/settings", CheckApp_1.REQUIREAUTH, AppConfigRoute_1.default);
router.use("/origin", CheckApp_1.REQUIREAUTH, OriginsRoute_1.default);
router.use("/quotes", CheckApp_1.REQUIREAUTH, QuoteRoute_1.default);
exports.default = router;
