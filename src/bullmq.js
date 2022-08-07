import {Queue, QueueScheduler, QueueEvents} from 'bullmq';
import {randomBytes} from 'node:crypto';

/** @typedef {import('ioredis').Redis} Redis */

/**
 * Initialize a new BullMQ queue.
 * @param {Redis} redisConn Redis connection
 * @return {Promise<{q: Queue, e: QueueEvents}>}
 */
export const initBullMQ = async (redisConn) => {
    redisConn.set('api_credential_key', randomBytes(5).toString('hex'));
    new QueueScheduler('stream', {
        connection: redisConn,
        maxStalledCount: 10,
    });

    return {
        q: new Queue('stream', {
            connection: redisConn,
            defaultJobOptions: {
                attempts: 3,
                removeOnFail: {
                    age: 60, // 1 minute
                },
                removeOnComplete: {
                    age: 60 * 5, // 5 minutes
                },
            },
        }),
        e: new QueueEvents('stream', {
            connection: redisConn,
        }),
    };
};
