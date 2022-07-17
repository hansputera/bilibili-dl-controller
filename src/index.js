import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import {initProcess} from './init-process.js';
import {apiRouter} from './routers/api.js';

const processResult = await initProcess();
const app = express();
app.set('trust proxy', true);
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
);
app.use(express.json());

app.set('bull_queue', processResult.bullmq_queue);
app.use('/api', apiRouter);

app.all('*', (_, res) =>
    res.status(404).json({
        message: 'The requested resource was not found.',
    }),
);

app.listen(parseInt(process.env.PORT) || 3000, '0.0.0.0', () => {
    console.log('Server starting...');
    console.log('Web Server running on', parseInt(process.env.PORT) || 3000);
});
