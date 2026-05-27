"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const revenueController_1 = require("../../../controllers/admin/revenueController");
const router = (0, express_1.Router)();
router.get("/summary", revenueController_1.GetSummary);
router.get("/:bookId", revenueController_1.GetBookRevenue);
exports.default = router;
