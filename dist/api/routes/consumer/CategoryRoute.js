"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const categoryController_1 = require("../../../controllers/categoryController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", categoryController_1.getCategories);
exports.default = router;
