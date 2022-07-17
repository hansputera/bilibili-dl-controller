import express from 'express';
import {jobCreateController} from '../controllers/createJobController.js';
import {jobInfoController} from '../controllers/jobInfoController.js';
import {jobListController} from '../controllers/jobListController.js';
import {keyAuthMiddleware} from '../middlewares/keyAuth.js';
import {ratelimitMiddleware} from '../middlewares/ratelimiter.js';
import {redis} from '../redis.js';

// eslint-disable-next-line new-cap
export const apiRouter = express.Router({
    caseSensitive: true,
});

apiRouter.use(ratelimitMiddleware);
apiRouter.use(keyAuthMiddleware);
apiRouter.get('/', (_, res) => res.sendStatus(200));
apiRouter.get('/redis_info', async (_, res) => {
    const info = await redis.info();
    return res.send(info.replace(/\n/g, '<br>'));
});
apiRouter.get('/jobs/:id', jobInfoController);
apiRouter.post('/jobs', jobCreateController);
apiRouter.get('/jobs', jobListController);
