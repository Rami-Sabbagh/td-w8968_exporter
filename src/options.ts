const options = {
    routerAddress: process.env.ROUTER_ADDRESS ?? '192.168.1.1',
    routerTimeout: Number.parseInt(process.env.ROUTER_TIMEOUT ?? '10'),
    adminUsername: process.env.ROUTER_USERNAME ?? 'admin',
    adminPassword: process.env.ROUTER_PASSWORD ?? 'admin',
    metricsPort: Number.parseInt(process.env.METRICS_PORT ?? '9926'),
};

export default options;