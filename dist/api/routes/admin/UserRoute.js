"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../../../controllers/admin/userController");
const router = (0, express_1.Router)();
router.post("/add", userController_1.CreateUser);
router.post("/login", userController_1.LoginUser);
router.post("/send-email", userController_1.SendEmail);
exports.default = router;
