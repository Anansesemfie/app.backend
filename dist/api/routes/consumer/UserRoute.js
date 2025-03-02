"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CheckApp_1 = require("../../middlewares/CheckApp");
const userController_1 = require("../../../controllers/userController");
const router = (0, express_1.Router)();
router.get("/logout/", CheckApp_1.CHECKAPPTOKEN, userController_1.LogoutUser);
router.get("/verify/:token", userController_1.verifyAccount);
router.post("/add", userController_1.CreateUser);
router.post("/login", userController_1.LoginUser);
router.post("/forgot-password", userController_1.forgotPassword);
router.post("/subscribe", CheckApp_1.CHECKAPPTOKEN, userController_1.createSubscription);
router.put("/subscribe/link", CheckApp_1.CHECKAPPTOKEN, userController_1.linkSubscription);
router.put("/reset-password", userController_1.resetPassword);
router.put("/forgot-password", userController_1.forgotPassword);
exports.default = router;
