"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const webHookCallBacks_1 = require("../../../controllers/webHookCallBacks");
const route = (0, express_1.Router)();
route.get("/paystack", webHookCallBacks_1.ActivateSubscription);
exports.default = route;
