import {Queue, QueueScheduler, QueueEvents} from 'bullmq';

/** @typedef {import('ioredis').Redis} Redis */

/**
 * Initialize a new BullMQ queue.
 * @param {Redis} redisConn Redis connection
 * @return {Promise<{q: Queue, e: QueueEvents}>}
 */
export const initBullMQ = async (redisConn) => {
    new QueueScheduler('stream', {
        connection: redisConn,
        maxStalledCount: 10,
    });

    return {
        q: new Queue('stream', {
            connection: redisConn,
            defaultJobOptions: {
                attempts: 3,
                removeOnComplete: true,
                removeOnFail: true,
            },
        }),
        e: new QueueEvents('stream', {
            connection: redisConn,
        }),
    };
};
