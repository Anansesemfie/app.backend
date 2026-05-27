"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const CheckApp_1 = require("../../middlewares/CheckApp");
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { code: "TOO_MANY_REQUESTS", message: "Too many attempts, please try again later", status: 429 },
});
const userController_1 = require("../../../controllers/userController");
const router = (0, express_1.Router)();
router.get("/logout/", CheckApp_1.REQUIREAUTH, userController_1.LogoutUser);
router.get("/verify/:token", userController_1.verifyAccount);
router.post("/add", authLimiter, userController_1.CreateUser);
router.post("/login", authLimiter, userController_1.LoginUser);
router.post("/forgot-password", authLimiter, userController_1.forgotPassword);
router.post("/subscribe", CheckApp_1.REQUIREAUTH, userController_1.createSubscription);
router.put("/subscribe/link", CheckApp_1.REQUIREAUTH, userController_1.linkSubscription);
router.put("/reset-password", userController_1.resetPassword);
router.put("/forgot-password", userController_1.forgotPassword);
exports.default = router;
