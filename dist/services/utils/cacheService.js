"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheService = void 0;
const redis_1 = require("../../utils/redis");
class CacheService {
    /**
     * Get value from cache
     * @param key Cache key
     * @returns Parsed value or null if not found or Redis is offline
     */
    static get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!redis_1.isRedisReady)
                return null;
            try {
                const data = yield redis_1.redisClient.get(key);
                return data ? JSON.parse(data) : null;
            }
            catch (error) {
                console.error(`CacheService Get Error [${key}]:`, error);
                return null;
            }
        });
    }
    /**
     * Set value in cache
     * @param key Cache key
     * @param value Value to store (will be JSON stringified)
     * @param ttl Time to live in seconds (default: 3600)
     */
    static set(key_1, value_1) {
        return __awaiter(this, arguments, void 0, function* (key, value, ttl = 3600) {
            if (!redis_1.isRedisReady)
                return;
            try {
                const stringValue = JSON.stringify(value);
                yield redis_1.redisClient.set(key, stringValue, {
                    EX: ttl,
                });
            }
            catch (error) {
                console.error(`CacheService Set Error [${key}]:`, error);
            }
        });
    }
    /**
     * Delete value from cache
     * @param key Cache key
     */
    static del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!redis_1.isRedisReady)
                return;
            try {
                yield redis_1.redisClient.del(key);
            }
            catch (error) {
                console.error(`CacheService Del Error [${key}]:`, error);
            }
        });
    }
    /**
     * Clear multiple keys by pattern
     * @param pattern Glob pattern (e.g., "user:*")
     */
    static clearPattern(pattern) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!redis_1.isRedisReady)
                return;
            try {
                const keys = yield redis_1.redisClient.keys(pattern);
                if (keys.length > 0) {
                    yield redis_1.redisClient.del(keys);
                }
            }
            catch (error) {
                console.error(`CacheService ClearPattern Error [${pattern}]:`, error);
            }
        });
    }
}
exports.CacheService = CacheService;
