"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const env_1 = require("../../../utils/env");
const CheckApp_1 = require("../../middlewares/CheckApp");
const LanguageRoute_1 = __importDefault(require("./LanguageRoute"));
const UserRoute_1 = __importDefault(require("./UserRoute"));
const BookRoute_1 = __importDefault(require("./BookRoute"));
const PeriodRoute_1 = __importDefault(require("./PeriodRoute"));
const OrgRoute_1 = __importDefault(require("./OrgRoute"));
// import Dashboard from "./DashboardRoute";
// import Subscriptions from "./SubscriptionsRoute";
// import Conversation from "./ConversationRoute";
// import Revenue from "./RevenueRoute";
const AppConfigRoute_1 = __importDefault(require("./AppConfigRoute"));
const OriginsRoute_1 = __importDefault(require("./OriginsRoute"));
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
router.use("/user", UserRoute_1.default);
router.use("/book", CheckApp_1.REQUIREAUTH, BookRoute_1.default);
router.use("/period", CheckApp_1.REQUIREAUTH, PeriodRoute_1.default);
router.use("/organization", CheckApp_1.REQUIREAUTH, OrgRoute_1.default);
// router.use("/dashboard", REQUIREAUTH, Dashboard);
// router.use("/subscription", REQUIREAUTH, Subscriptions);
// router.use("/subscriptions", REQUIREAUTH, Subscriptions);
// router.use("/conversation", REQUIREAUTH, Conversation);
// router.use("/revenue", REQUIREAUTH, Revenue);
router.use("/settings", CheckApp_1.REQUIREAUTH, AppConfigRoute_1.default);
router.use("/origin", CheckApp_1.REQUIREAUTH, OriginsRoute_1.default);
exports.default = router;
