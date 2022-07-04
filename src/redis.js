import Redis from 'ioredis';

/**
 * Create a new Redis client.
 * @return {Redis}
 */
export const getRedis = () =>
    new Redis(process.env.REDIS_URL ?? 'redis://:@localhost:6379', {
        maxRetriesPerRequest: null,
    });
