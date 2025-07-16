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
router.use("/language", CheckApp_1.CHECKAPPTOKEN, LanguageRoute_1.default);
router.use("/user", UserRoute_1.default);
router.use("/book", CheckApp_1.CHECKAPPTOKEN, BookRoute_1.default);
router.use("/period", CheckApp_1.CHECKAPPTOKEN, PeriodRoute_1.default);
router.use("/organization", CheckApp_1.CHECKAPPTOKEN, OrgRoute_1.default);
exports.default = router;
