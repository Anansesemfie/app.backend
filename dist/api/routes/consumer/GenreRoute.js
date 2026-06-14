"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const genreController_1 = require("../../../controllers/genreController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", genreController_1.getGenres);
router.get("/:id", genreController_1.getGenre);
exports.default = router;
