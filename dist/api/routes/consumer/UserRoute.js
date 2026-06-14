"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CheckApp_1 = require("../../middlewares/CheckApp");
const rateLimiter_1 = require("../../middlewares/rateLimiter");
const authLimiter = (0, rateLimiter_1.createLimiter)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { code: "TOO_MANY_REQUESTS", message: "Too many attempts, please try again later", status: 429 },
});
const userController_1 = require("../../../controllers/userController");
const router = (0, express_1.Router)();
router.get("/logout/", CheckApp_1.REQUIREAUTH, userController_1.LogoutUser);
router.get("/profile", CheckApp_1.REQUIREAUTH, userController_1.getProfile);
router.get("/verify/:token", userController_1.verifyAccount);
router.post("/add", authLimiter, userController_1.CreateUser);
router.post("/login", authLimiter, userController_1.LoginUser);
router.post("/forgot-password", authLimiter, userController_1.forgotPassword);
router.post("/subscribe", CheckApp_1.REQUIREAUTH, userController_1.createSubscription);
router.patch("/profile", CheckApp_1.REQUIREAUTH, userController_1.updateProfile);
router.put("/subscribe/link", CheckApp_1.REQUIREAUTH, userController_1.linkSubscription);
router.put("/reset-password", userController_1.resetPassword);
router.put("/forgot-password", userController_1.forgotPassword);
exports.default = router;
