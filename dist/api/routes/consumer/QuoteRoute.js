"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quoteController_1 = require("../../../controllers/admin/quoteController");
const router = (0, express_1.Router)();
router.get("/", quoteController_1.FetchActiveQuotes);
exports.default = router;
