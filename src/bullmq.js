import {Queue, QueueScheduler} from 'bullmq';

/** @typedef {import('ioredis').Redis} Redis */

/**
 * Initialize a new BullMQ queue.
 * @param {Redis} redisConn Redis connection
 * @return {Queue}
 */
export const initBullMQ = async (redisConn) => {
    new QueueScheduler('stream', {
        connection: redisConn,
        maxStalledCount: 10,
    });

    return new Queue('stream', {
        connection: redisConn,
        defaultJobOptions: {
            attempts: 3,
        },
    });
};
