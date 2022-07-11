import express from 'express';
import {downloadApiController} from '../controllers/downloadApiController.js';
import {jobApiController} from '../controllers/jobApiController.js';
import {ratelimitMiddleware} from '../middlewares/ratelimiter.js';
import {redis} from '../redis.js';

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
apiRouter.get('/jobs/:id', jobApiController);
