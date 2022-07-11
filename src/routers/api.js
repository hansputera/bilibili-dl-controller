import express from 'express';
import {downloadApiController} from '../controllers/downloadApiController.js';
import {ratelimitMiddleware} from '../middlewares/ratelimiter.js';
import {redis} from '../redis.js';

/** @typedef {import('bullmq').Job} Job */

// eslint-disable-next-line new-cap
export const apiRouter = express.Router({
    caseSensitive: true,
});

apiRouter.use(ratelimitMiddleware);
apiRouter.get('/', (_, res) => res.sendStatus(200));
apiRouter.get('/redis_info', async (_, res) => {
    const info = await redis.info();
    return res.send(info.replace(/\n/g, '<br>'));
});
apiRouter.post('/download', downloadApiController);
apiRouter.get('/jobs/:id', async (req, res) => {
    /** @type {Job} */
    const job = await req.app.settings['bull_queue'].getJob(req.params.id);
    if (!job) {
        return res.status(404).json({
            message: 'Job not found',
        });
    } else if (job && !job.returnvalue) {
        job.remove();
        return res.status(404).json({
            message: "It's failed job, please retry",
        });
    }

    return res.status(200).json(job.returnvalue);
});
