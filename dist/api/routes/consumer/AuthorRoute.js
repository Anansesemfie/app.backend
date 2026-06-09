"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorController_1 = require("../../../controllers/authorController");
const router = (0, express_1.Router)();
router.get("/", authorController_1.getAuthors);
router.get("/:id", authorController_1.getAuthor);
exports.default = router;
