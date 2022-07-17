import Redis from 'ioredis';

export const redis = new Redis(
    process.env.REDIS_URL ?? 'redis://:@localhost:6379',
    {
        maxRetriesPerRequest: null,
    },
);

redis.on('error', (err) => {
    console.error('Redis Error:', err);
});
