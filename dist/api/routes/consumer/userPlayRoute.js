"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const playController_1 = require("../../../controllers/playController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/:chapter", playController_1.Play);
exports.default = router;
