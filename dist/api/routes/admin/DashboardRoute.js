"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../../../controllers/admin/dashboardController");
const router = (0, express_1.Router)();
router.get("/stats", dashboardController_1.GetStats);
router.get("/pulse", dashboardController_1.GetPulse);
exports.default = router;
