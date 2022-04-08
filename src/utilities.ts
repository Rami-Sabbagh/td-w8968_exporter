export function encodeBase64(data: string) {
    return Buffer.from(data).toString('base64');
}

export function parseIntFromRejexCapture(data: string, regex: RegExp) {
    return Number.parseInt(data.match(regex)?.[1] ?? '0');
}

export function formatIP(ip: number) {
    const octets = [
        (ip >> 24) & 0xFF,
        (ip >> 16) & 0xFF,
        (ip >> 8) & 0xFF,
        ip & 0xFF,
    ];

    return octets.join('.');
}