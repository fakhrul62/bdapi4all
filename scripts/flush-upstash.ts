import { config } from "dotenv";
import { Redis } from "@upstash/redis";

config({ path: ".env.local" });
config();

async function main() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  console.log("Connecting to Upstash Redis:", url);
  if (!url || !token) {
    console.error("Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN");
    return;
  }

  const redis = new Redis({ url, token });
  try {
    const res = await redis.flushdb();
    console.log("Upstash Redis flushdb result:", res);
  } catch (err) {
    console.error("Error flushing Upstash Redis:", err);
  }
}

main();
