import { createClient } from "redis";

export const redis = createClient({
  url: "redis://:admin@localhost:6379",
});

redis.connect();