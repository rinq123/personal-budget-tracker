import  { Redis } from 'ioredis';
import type { Request, Response, NextFunction } from "express";

const redisUrl = process.env.REDIS_URL;

if(!redisUrl) {
    throw new Error("REDIS_URL is required");
}

const redis = new Redis(redisUrl);


export async function rateLimiter(req: Request, res: Response, next: NextFunction){
    const ip = req.ip;
    const key = `rate-limit:${ip}`;

    const limit = 100; // Max Requests
    const windowTime = 15 * 60; // 15 minutes in seconds

    const requests = await redis.incr(key);

    if(requests === 1){
        await redis.expire(key, windowTime);
    }

    if(requests > limit){
        return res.status(429).json({ message: "Too many requests, try again later."});
    }

    next();
};

