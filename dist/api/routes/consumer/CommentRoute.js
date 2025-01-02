"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commentController_1 = require("../../../controllers/commentController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/', commentController_1.postComment);
router.get('/:bookId', commentController_1.getComments);
exports.default = router;
