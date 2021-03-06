import axios from 'axios';

import options from './options';
import { encodeBase64 } from './utilities';

const authorizationToken = `Basic ${encodeBase64(`${options.adminUsername}:${options.adminPassword}`)}`;

const client = axios.create({
    baseURL: `http://${options.routerAddress}/`,
    timeout: options.routerTimeout * 1_000,
    headers: {
        'Cookie': `Authorization=${authorizationToken}`,
        'Referer': `http://${options.routerAddress}/`,
    },
    responseType: 'text',
});

export default client;