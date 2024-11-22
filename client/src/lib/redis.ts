import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

export const redis = createClient({
  password: process.env.REDISPASSWORD,
  socket: {
    host: "redis-19930.c305.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 19930,
  },
});

redis.on("error", (err) => {
  console.log("Redis Client Error", err);
  if (err.errno == -3008) {
    console.log("check internet connection");

    let timeout = 10,
      count = 1;
    const interval = setInterval(() => {
      if (count == 10) {
        console.log(`retrying in ${timeout} secs`);
        if (timeout == 0) {
          clearInterval(interval);
        }
        timeout--;
        count = 1;
      }
      count++;
    }, 100);
  }
});

// (async () => {
//     try {
//       await client.connect();
//       console.log("Redis client connected successfully.");
  
//       // Check if the client is ready before running any commands
//       const pingResult = await client.ping();
//       console.log("Redis Client Ping:", pingResult);
  
//     } catch (err) {
//       console.error("Failed to connect to Redis:", err);
//     }
  
// })();

export default redis;
