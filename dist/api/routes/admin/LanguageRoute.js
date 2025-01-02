"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const languageController_1 = require("../../../controllers/languageController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/add", languageController_1.createLanguage);
router.get("/all", languageController_1.getAll);
exports.default = router;
