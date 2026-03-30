import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisPassword = process.env.REDIS_PASSWORD;
let redisHost = process.env.REDIS_HOST || "127.0.0.1";

let redisClient = null; // Defer creation until connectRedis() is called

function createRedisClient(host, usePassword = true) {
  const clientConfig = {
    socket: {
      host,
      port: redisPort,
      connectTimeout: 5000,
      reconnectStrategy: () => false,
    },
  };
  
  if (usePassword && redisPassword) {
    clientConfig.password = redisPassword;
  }
  
  const client = createClient(clientConfig);
  
  client.on("connect", () => {
    console.log(`Redis connected (host: ${host}:${redisPort})`);
  });
  
  client.on("error", (err) => {
    console.error("Redis error:", err?.message || err);
  });
  
  return client;
}

export async function connectRedis() {
  // Initialize client on first call if not already done
  if (!redisClient) {
    redisClient = createRedisClient(redisHost, true);
  }
  
  if (redisClient.isOpen) {
    return true;
  }

  try {
    await redisClient.connect();
    return true;
  } catch (error) {
    // If DNS resolution fails for the configured host (e.g., "redis" when not in Docker),
    // try localhost as fallback
    if (error?.code === "EAI_AGAIN" && redisHost !== "127.0.0.1") {
      console.warn(`Failed to resolve "${redisHost}", trying localhost...`);
      
      // Clean up the failed client completely
      redisClient.quit().catch(() => {});
      
      // Create new client with fallback host (without password for local dev instance)
      redisClient = createRedisClient("127.0.0.1", false);

      try {
        await redisClient.connect();
        redisHost = "127.0.0.1";
        return true;
      } catch (fallbackError) {
        console.error(
          "Redis connection failed on localhost too:",
          fallbackError?.message || fallbackError
        );
        return false;
      }
    }

    console.error("Redis connection failed:", error?.message || error);
    return false;
  }
}

export default redisClient;
