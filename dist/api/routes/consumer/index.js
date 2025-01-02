"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const env_1 = require("../../../utils/env");
const CheckApp_1 = require("../../middlewares/CheckApp");
const UserRoute_1 = __importDefault(require("./UserRoute"));
const BookRoute_1 = __importDefault(require("./BookRoute"));
const userPlayRoute_1 = __importDefault(require("./userPlayRoute"));
const SubscriptionRoute_1 = __importDefault(require("./SubscriptionRoute"));
const webHookCallBacks_1 = __importDefault(require("./webHookCallBacks"));
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    return res.status(200).json({
        message: "Welcome to Anansesemfie",
        endpoints: {
            staging: `http://localhost:${env_1.PORT}/`,
            production: "coming soon....",
        },
        version: "1.0",
    });
});
router.use("/user", UserRoute_1.default);
router.use("/whcb", webHookCallBacks_1.default);
router.use("/book/", CheckApp_1.CHECKAPPTOKEN, BookRoute_1.default);
router.use("/chapter/play", CheckApp_1.CHECKAPPTOKEN, userPlayRoute_1.default);
router.use("/subscription", SubscriptionRoute_1.default);
exports.default = router;
