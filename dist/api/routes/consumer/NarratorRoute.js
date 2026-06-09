"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const narratorController_1 = require("../../../controllers/narratorController");
const router = (0, express_1.Router)();
router.get("/", narratorController_1.getNarrators);
router.get("/:id", narratorController_1.getNarrator);
exports.default = router;
