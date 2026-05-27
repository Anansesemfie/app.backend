"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appConfigController_1 = require("../../../controllers/admin/appConfigController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", appConfigController_1.GetSettings);
router.put("/", appConfigController_1.UpdateSettings);
exports.default = router;
