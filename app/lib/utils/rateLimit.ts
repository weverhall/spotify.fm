import { getRedisClient } from './redis';

export const isRateLimited = async (
  key: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> => {
  try {
    const redis = await getRedisClient();
    const redisKey = `ratelimit:${key}`;

    const count = await redis.incr(redisKey);
    if (count === 1 || (await redis.ttl(redisKey)) === -1) {
      await redis.expire(redisKey, windowSeconds);
    }

    return count > limit;
  } catch (err) {
    console.error('rate limit check failed:', err);
    return false;
  }
};
