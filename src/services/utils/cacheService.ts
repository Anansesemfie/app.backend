import { redisClient, isRedisReady } from "../../utils/redis";

export class CacheService {
  /**
   * Get value from cache
   * @param key Cache key
   * @returns Parsed value or null if not found or Redis is offline
   */
  static async get<T>(key: string): Promise<T | null> {
    if (!isRedisReady) return null;
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`CacheService Get Error [${key}]:`, error);
      return null;
    }
  }

  /**
   * Set value in cache
   * @param key Cache key
   * @param value Value to store (will be JSON stringified)
   * @param ttl Time to live in seconds (default: 3600)
   */
  static async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    if (!isRedisReady) return;
    try {
      const stringValue = JSON.stringify(value);
      await redisClient.set(key, stringValue, {
        EX: ttl,
      });
    } catch (error) {
      console.error(`CacheService Set Error [${key}]:`, error);
    }
  }

  /**
   * Delete value from cache
   * @param key Cache key
   */
  static async del(key: string): Promise<void> {
    if (!isRedisReady) return;
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error(`CacheService Del Error [${key}]:`, error);
    }
  }

  /**
   * Clear multiple keys by pattern
   * @param pattern Glob pattern (e.g., "user:*")
   */
  static async clearPattern(pattern: string): Promise<void> {
    if (!isRedisReady) return;
    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (error) {
      console.error(`CacheService ClearPattern Error [${pattern}]:`, error);
    }
  }
}
