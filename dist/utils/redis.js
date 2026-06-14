"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = exports.isRedisReady = void 0;
const redis_1 = require("redis");
const env_1 = require("./env");
exports.isRedisReady = false;
const redisClient = (0, redis_1.createClient)({
    url: env_1.REDIS_URL,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.warn("Redis: Max reconnection retries reached. Staying offline.");
                return false;
            }
            return Math.min(retries * 100, 3000);
        },
    },
});
exports.redisClient = redisClient;
redisClient.on("error", (err) => {
    if (exports.isRedisReady) {
        console.error("Redis Error:", err.message);
    }
    exports.isRedisReady = false;
});
redisClient.on("connect", () => {
    console.log("Redis: Connecting...");
});
redisClient.on("ready", () => {
    console.log("Redis: Ready and Connected");
    exports.isRedisReady = true;
});
redisClient.on("end", () => {
    console.warn("Redis: Connection closed");
    exports.isRedisReady = false;
});
// Initialize connection
redisClient.connect().catch((err) => {
    console.warn("Redis: Initial connection failed. Application will run without Redis.", err.message);
});
