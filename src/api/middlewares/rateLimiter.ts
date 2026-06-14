import rateLimit, { Options } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient, isRedisReady } from "../../utils/redis";
import { Request, Response, NextFunction } from "express";

/**
 * Creates a dynamic rate limiter that switches between Redis and Memory
 * based on the current connection status.
 */
export const createLimiter = (options: Partial<Options>) => {
  const baseOptions: Partial<Options> = {
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { 
      code: "TOO_MANY_REQUESTS", 
      message: "Too many requests, please try again later", 
      status: 429 
    },
    ...options,
  };

  // Create two limiters: one for Redis and one for Memory
  const redisLimiter = rateLimit({
    ...baseOptions,
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
  });

  const memoryLimiter = rateLimit(baseOptions);

  // Return a wrapper middleware that chooses the limiter based on Redis status
  return (req: Request, res: Response, next: NextFunction) => {
    const limiter = isRedisReady ? redisLimiter : memoryLimiter;
    return limiter(req, res, next);
  };
};
