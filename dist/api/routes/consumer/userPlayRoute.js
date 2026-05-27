"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const playController_1 = require("../../../controllers/playController");
const express_1 = require("express");
const CheckApp_1 = require("../../middlewares/CheckApp");
const router = (0, express_1.Router)();
router.get("/:chapter", CheckApp_1.REQUIREAUTH, playController_1.Play);
exports.default = router;
