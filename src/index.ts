import express from 'express';
import { register } from './metrics';

const server = express();

server.get('/metrics', async (_, res) => {
    try {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics());
    } catch (error) {
        console.error(error);
        res.status(500).end(`${error}`);
    }
});

const port = process.env.PORT ?? 19001;
server.listen(port, () => console.log(`Listening on port ${port}\nMetrics available at http://localhost:${port}/metrics`));
