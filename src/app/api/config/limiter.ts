import { RateLimiter } from "limiter";

// can be created for every API endpoint individually
export const limiter = new RateLimiter({
  tokensPerInterval: 3, // limit to 3 requests per interval
  interval: "minute", // interval value
  fireImmediately: true, // makes it to work asynchronously
});
