import express from 'express';

import options from './options';
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

const port = options.metricsPort;
server.listen(port, () => console.log(`Listening on port ${port}\nMetrics available at http://localhost:${port}/metrics`));
