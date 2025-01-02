"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const subscriptionsController_1 = require("../../../controllers/subscriptionsController");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/:subscriptionId", subscriptionsController_1.getSubscription);
router.get("/", subscriptionsController_1.getSubscriptions);
exports.default = router;
