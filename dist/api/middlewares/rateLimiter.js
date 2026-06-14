"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const rate_limit_redis_1 = require("rate-limit-redis");
const redis_1 = require("../../utils/redis");
/**
 * Creates a dynamic rate limiter that switches between Redis and Memory
 * based on the current connection status.
 */
const createLimiter = (options) => {
    const baseOptions = Object.assign({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false, message: {
            code: "TOO_MANY_REQUESTS",
            message: "Too many requests, please try again later",
            status: 429
        } }, options);
    // Create two limiters: one for Redis and one for Memory
    const redisLimiter = (0, express_rate_limit_1.default)(Object.assign(Object.assign({}, baseOptions), { store: new rate_limit_redis_1.RedisStore({
            sendCommand: (...args) => redis_1.redisClient.sendCommand(args),
        }) }));
    const memoryLimiter = (0, express_rate_limit_1.default)(baseOptions);
    // Return a wrapper middleware that chooses the limiter based on Redis status
    return (req, res, next) => {
        const limiter = redis_1.isRedisReady ? redisLimiter : memoryLimiter;
        return limiter(req, res, next);
    };
};
exports.createLimiter = createLimiter;
