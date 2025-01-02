"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chapterController_1 = require("../../../controllers/chapterController");
const CheckApp_1 = require("../../middlewares/CheckApp");
const router = (0, express_1.Router)();
router.get("/all/:bookId", CheckApp_1.CHECKAPPTOKEN, chapterController_1.getChapters);
router.get("/:chapterId", CheckApp_1.CHECKAPPTOKEN, chapterController_1.getChapter);
exports.default = router;
