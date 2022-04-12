
import { Registry, Counter, Gauge, collectDefaultMetrics } from 'prom-client';
import { DSLStatus, fetchDSLStatus, fetchTrafficStatistics, TrafficStatistics } from './router-api';

export const register = new Registry();

let lastFetched = 0;

let cachedDSLStatus: DSLStatus | undefined = undefined;
let cachedTrafficStatistics: TrafficStatistics | undefined = undefined;

async function fetchData() {
    if (new Date().valueOf() - lastFetched >= 1_000) {
        cachedDSLStatus = await fetchDSLStatus().catch(console.warn) ?? undefined;
        cachedTrafficStatistics = await fetchTrafficStatistics().catch(console.warn) ?? undefined;

        lastFetched = new Date().valueOf();
    }

    return { dslStatus: cachedDSLStatus, trafficStatistics: cachedTrafficStatistics };
}

// DSL status metrics
{
    new Counter({
        name: 'router_dsl_uptime',
        help: 'DSL uptime in seconds',
        registers: [register],
        async collect() {
            const { dslStatus } = await fetchData();
            if (!dslStatus) return;

            this.reset();
            this.inc(dslStatus.uptime);
        },
    });

    // Upstream metrics
    {
        new Gauge({
            name: 'router_dsl_upstream_current_rate',
            help: 'Upstream current rate in Kbps',
            registers: [register],
            async collect() {
                const { dslStatus } = await fetchData();
                if (!dslStatus) return;

                this.reset();
                this.set(dslStatus.upstream.currentRate);
            }
        });

        new Gauge({
            name: 'router_dsl_upstream_max_rate',
            help: 'Upstream max rate in Kbps',
            registers: [register],
            async collect() {
                const { dslStatus } = await fetchData();
                if (!dslStatus) return;

                this.reset();
                this.set(dslStatus.upstream.maxRate);
            }
        });

        new Gauge({
            name: 'router_dsl_upstream_signal_to_noise_ratio',
            help: 'Upstream SNR margin in dB',
            registers: [register],
            async collect() {
                const { dslStatus } = await fetchData();
                if (!dslStatus) return;

                this.reset();
                this.set(dslStatus.upstream.signalToNoiseRatio);
            }
        });

        new Gauge({
            name: 'router_dsl_upstream_line_attenuation',
            help: 'Upstream line attenuation in dB',
            registers: [register],
            async collect() {
                const { dslStatus } = await fetchData();
                if (!dslStatus) return;

                this.reset();
                this.set(dslStatus.upstream.lineAttenuation);
            }
        });
    }

    // Downstream metrics
    {
        new Gauge({
            name: 'router_dsl_downstream_current_rate',
            help: 'Downstream current rate in Kbps',
            registers: [register],
            async collect() {
                const { dslStatus } = await fetchData();
                if (!dslStatus) return;

                this.reset();
                this.set(dslStatus.downstream.currentRate);
            }
        });

        new Gauge({
            name: 'router_dsl_downstream_max_rate',
            help: 'Downstream max rate in Kbps',
            registers: [register],
            async collect() {
                const { dslStatus } = await fetchData();
                if (!dslStatus) return;

                this.reset();
                this.set(dslStatus.downstream.maxRate);
            }
        });

        new Gauge({
            name: 'router_dsl_downstream_signal_to_noise_ratio',
            help: 'Downstream SNR margin in dB',
            registers: [register],
            async collect() {
                const { dslStatus } = await fetchData();
                if (!dslStatus) return;

                this.reset();
                this.set(dslStatus.downstream.signalToNoiseRatio);
            }
        });

        new Gauge({
            name: 'router_dsl_downstream_line_attenuation',
            help: 'Downstream line attenuation in dB',
            registers: [register],
            async collect() {
                const { dslStatus } = await fetchData();
                if (!dslStatus) return;

                this.reset();
                this.set(dslStatus.downstream.lineAttenuation);
            }
        });
    }
}

// Traffic statistics metrics
{
    new Counter({
        name: 'router_traffic_total_bytes',
        help: 'Total bytes transmitted',
        registers: [register],
        labelNames: ['ip', 'mac'],
        async collect() {
            const { trafficStatistics } = await fetchData();
            if (!trafficStatistics) return;

            this.reset();

            for (const entry of trafficStatistics)
                this.inc({ ip: entry.ipAddress, mac: entry.macAddress }, entry.totalBytes);
        }
    });

    new Counter({
        name: 'router_traffic_total_packets',
        help: 'Total packets transmitted',
        registers: [register],
        labelNames: ['ip', 'mac'],
        async collect() {
            const { trafficStatistics } = await fetchData();
            if (!trafficStatistics) return;

            this.reset();

            for (const entry of trafficStatistics)
                this.inc({ ip: entry.ipAddress, mac: entry.macAddress }, entry.totalPackets);
        }
    });

    new Gauge({
        name: 'router_traffic_current_bytes',
        help: 'Current bytes transmitted',
        registers: [register],
        labelNames: ['ip', 'mac'],
        async collect() {
            const { trafficStatistics } = await fetchData();
            if (!trafficStatistics) return;

            this.reset();

            for (const entry of trafficStatistics)
                this.inc({ ip: entry.ipAddress, mac: entry.macAddress }, entry.currentBytes);
        }
    });

    new Gauge({
        name: 'router_traffic_current_packets',
        help: 'Current packets transmitted',
        registers: [register],
        labelNames: ['ip', 'mac'],
        async collect() {
            const { trafficStatistics } = await fetchData();
            if (!trafficStatistics) return;

            this.reset();

            for (const entry of trafficStatistics)
                this.inc({ ip: entry.ipAddress, mac: entry.macAddress }, entry.currentPackets);
        }
    });

    // Detailed packets metrics
    {
        new Gauge({
            name: 'router_traffic_current_icmp_packets',
            help: 'Current ICMP packets transmitted',
            registers: [register],
            labelNames: ['ip', 'mac'],
            async collect() {
                const { trafficStatistics } = await fetchData();
                if (!trafficStatistics) return;

                this.reset();

                for (const entry of trafficStatistics)
                    this.inc({ ip: entry.ipAddress, mac: entry.macAddress }, entry.currentICMP);
            }
        });

        new Gauge({
            name: 'router_traffic_current_udp_packets',
            help: 'Current UDP packets transmitted',
            registers: [register],
            labelNames: ['ip', 'mac'],
            async collect() {
                const { trafficStatistics } = await fetchData();
                if (!trafficStatistics) return;

                this.reset();

                for (const entry of trafficStatistics)
                    this.inc({ ip: entry.ipAddress, mac: entry.macAddress }, entry.currentUDP);
            }
        });

        new Gauge({
            name: 'router_traffic_current_syn_packets',
            help: 'Current SYN packets transmitted',
            registers: [register],
            labelNames: ['ip', 'mac'],
            async collect() {
                const { trafficStatistics } = await fetchData();
                if (!trafficStatistics) return;

                this.reset();

                for (const entry of trafficStatistics)
                    this.inc({ ip: entry.ipAddress, mac: entry.macAddress }, entry.currentSYN);
            }
        });

        new Gauge({
            name: 'router_traffic_current_icmp_max_packets',
            help: 'Current ICMP maximum transmission packets',
            registers: [register],
            labelNames: ['ip', 'mac'],
            async collect() {
                const { trafficStatistics } = await fetchData();
                if (!trafficStatistics) return;

                this.reset();

                for (const entry of trafficStatistics)
                    this.inc({ ip: entry.ipAddress, mac: entry.macAddress }, entry.currentICMPMax);
            }
        });

        new Gauge({
            name: 'router_traffic_current_udp_max_packets',
            help: 'Current UDP maximum transmission packets',
            registers: [register],
            labelNames: ['ip', 'mac'],
            async collect() {
                const { trafficStatistics } = await fetchData();
                if (!trafficStatistics) return;

                this.reset();

                for (const entry of trafficStatistics)
                    this.inc({ ip: entry.ipAddress, mac: entry.macAddress }, entry.currentUDPMax);
            }
        });

        new Gauge({
            name: 'router_traffic_current_syn_max_packets',
            help: 'Current SYN maximum transmission packets',
            registers: [register],
            labelNames: ['ip', 'mac'],
            async collect() {
                const { trafficStatistics } = await fetchData();
                if (!trafficStatistics) return;

                this.reset();

                for (const entry of trafficStatistics)
                    this.inc({ ip: entry.ipAddress, mac: entry.macAddress }, entry.currentSYNMax);
            }
        });
    }
}

collectDefaultMetrics({ register });
