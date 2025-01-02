"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const languageController_1 = require("../../../controllers/languageController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", languageController_1.getAll);
exports.default = router;
