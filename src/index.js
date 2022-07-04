import 'dotenv/config';

import express from 'express';
import cors from 'cors';

const app = express();
app.use(
    cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }),
);

app.listen(parseInt(process.env.PORT) || 3000, '0.0.0.0', () => {
    console.log('Server started');
});
