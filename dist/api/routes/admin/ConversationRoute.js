"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const conversationController_1 = require("../../../controllers/admin/conversationController");
const router = (0, express_1.Router)();
router.get("/comments", conversationController_1.GetComments);
router.delete("/comments/:id", conversationController_1.DeleteComment);
exports.default = router;
