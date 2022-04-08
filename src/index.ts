import { fetchDSLStatus, fetchTrafficStatistics } from './router-api';

async function main() {
    console.info('fetching data...');
    const status = await fetchDSLStatus();
    const statistics = await fetchTrafficStatistics();
    console.info('fetched successfully');

    console.log(status);
    console.log(statistics);
}

main().catch(console.error);