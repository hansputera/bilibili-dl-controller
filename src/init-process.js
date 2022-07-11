import {initBullMQ} from './bullmq.js';
import {saveIP} from './background_jobs/save-ip.js';
import {redis} from './redis.js';
import {jobCompletedHandler} from './bullmq_handlers/jobCompleted.js';
import {saveEntriesIP} from './stores/ratelimitIPs.js';

/** @typedef {import('ioredis').Redis} Redis */

export const initProcess = async () => {
    console.log('Initializing process...');
    saveIP(redis);

    // receiving saved ratelimit ips.
    const savedIPs = await redis.get('ratelimit_ips');
    if (typeof savedIPs === 'string') saveEntriesIP(savedIPs);

    const {q: queue, e: queueEvents} = await initBullMQ(redis);

    queueEvents
        .on('waiting', async ({jobId}) => {
            console.log(`Job ${jobId} is waiting.`);
        })
        .on('stalled', async ({jobId}) => {
            console.log(`Job ${jobId} is stalled.`);
        })
        .on('error', console.error)
        .on('failed', async ({jobId, failedReason}) => {
            console.log(`Job ${jobId} failed with reason: ${failedReason}`);
        })
        .on('completed', async ({jobId, returnvalue}) =>
            jobCompletedHandler(jobId, returnvalue),
        );
    console.log('Process initialized.');

    return {
        bullmq_queue: queue,
    };
};
