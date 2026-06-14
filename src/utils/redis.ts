import { createClient } from "redis";
import { REDIS_URL } from "./env";

export let isRedisReady = false;

const redisClient = createClient({
  url: REDIS_URL,
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

redisClient.on("error", (err) => {
  if (isRedisReady) {
    console.error("Redis Error:", err.message);
  }
  isRedisReady = false;
});

redisClient.on("connect", () => {
  console.log("Redis: Connecting...");
});

redisClient.on("ready", () => {
  console.log("Redis: Ready and Connected");
  isRedisReady = true;
});

redisClient.on("end", () => {
  console.warn("Redis: Connection closed");
  isRedisReady = false;
});

// Initialize connection
redisClient.connect().catch((err) => {
  console.warn("Redis: Initial connection failed. Application will run without Redis.", err.message);
});

export { redisClient };
