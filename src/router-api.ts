import fs from 'fs';
import path from 'path';

import client from './router-client';
import { parseIntFromRejexCapture, formatIP } from './utilities';

function loadPayload(name: string) {
    return fs.readFileSync(path.resolve(__dirname, `../data/${name}.json`), 'utf8').replace(/([^\r])\n/g, '$1\r\n');
}

const payloads = {
    dslStatus: loadPayload('dsl-status'),
    trafficStatistics: loadPayload('traffic-statistics'),
};

export async function fetchDSLStatus() {
    const { data } = await client.post<string>('/cgi?1&5', payloads.dslStatus);
    
    return {
        /**
         * Could be 'Up', 'Down' or something else.
         */
        status: data.match(/status=(\S+)/)?.[1] ?? '',
        /**
         * in seconds
         */
        uptime: parseIntFromRejexCapture(data, /X_TP_DSLUpTime=(\d+)/),
        upstream: {
            /**
             * in Kbps
             */
            currentRate: parseIntFromRejexCapture(data, /upstreamCurrRate=(\d+)/),
            /**
             * in Kbps
             */
            maxRate: parseIntFromRejexCapture(data, /upstreamMaxRate=(\d+)/),
            /**
             * (SNR) in dB
             */
            signalToNoiseRatio: parseIntFromRejexCapture(data, /upstreamNoiseMargin=(\d+)/) / 10,
            /**
             * in dB
             */
            lineAttenuation: parseIntFromRejexCapture(data, /upstreamAttenuation=(\d+)/) / 10,
        },
        downstream: {
            /**
             * in Kbps
             */
            currentRate: parseIntFromRejexCapture(data, /downstreamCurrRate=(\d+)/),
            /**
             * in Kbps
             */
            maxRate: parseIntFromRejexCapture(data, /downstreamMaxRate=(\d+)/),
            /**
             * (SNR) in dB
             */
            signalToNoiseRatio: parseIntFromRejexCapture(data, /downstreamNoiseMargin=(\d+)/) / 10,
            /**
             * in dB
             */
            lineAttenuation: parseIntFromRejexCapture(data, /downstreamAttenuation=(\d+)/) / 10,
        },
    };
}

export type DSLStatus = Awaited<ReturnType<typeof fetchDSLStatus>>;

export async function fetchTrafficStatistics() {
    const { data } = await client.post<string>('/cgi?1&5', payloads.trafficStatistics);

    const entries = [];

    for (const [section] of data.matchAll(/\[[\d,]+\]1[^\[]*/g)) {
        entries.push({
            ipAddress: formatIP(Number.parseInt(section.match(/ipAddress=(\d+)/)?.[1] ?? '0')),
            macAddress: section.match(/macAddress=((?:[\dA-Fa-f]{2}:?){6})/)?.[1] ?? '00:00:00:00:00:00',

            totalPackets: parseIntFromRejexCapture(section, /totalPkts=(\d+)/),
            totalBytes: parseIntFromRejexCapture(section, /totalBytes=(\d+)/),

            currentPackets: parseIntFromRejexCapture(section, /currPkts=(\d+)/),
            currentBytes: parseIntFromRejexCapture(section, /currBytes=(\d+)/),

            currentICMP: parseIntFromRejexCapture(section, /currIcmp=(\d+)/),
            currentICMPMax: parseIntFromRejexCapture(section, /currIcmpMax=(\d+)/),

            currentUDP: parseIntFromRejexCapture(section, /currUdp=(\d+)/),
            currentUDPMax: parseIntFromRejexCapture(section, /currUdpMax=(\d+)/),

            currentSYN: parseIntFromRejexCapture(section, /currSyn=(\d+)/),
            currentSYNMax: parseIntFromRejexCapture(section, /currSynMax=(\d+)/),
        });
    }

    return entries;
}

export type TrafficStatistics = Awaited<ReturnType<typeof fetchTrafficStatistics>>;
export type TrafficStatisticsEntry = TrafficStatistics[number];
