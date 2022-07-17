import got from 'got';
import {worker} from 'workerpool';
import net from 'node:net';

import {publicConfig} from '../../public-config.js';
import {ratelimitIPs} from '../stores/ratelimitIPs.js';

/**
 * Check if the ip is safe.
 * @param {string} ip An IP address
 * @return {Promise<boolean>}
 */
export const ipSafe = async (ip) => {
    const data = await got('https://api.abuseipdb.com/api/v2/check', {
        searchParams: {
            maxAgeInDays: 120,
            ipAddress: ip,
        },
        headers: {
            Key: process.env.ABUSEIP_DB_KEY,
            Accept: 'application/json',
        },
    })
        .json()
        .catch(() => undefined);

    console.log(data);
    if (!data) return false;
    else {
        const dataIP = data.data;
        if (
            !dataIP.isWhitelisted &&
            dataIP.abuseConfidenceScore >= publicConfig.safeIp.confidence &&
            dataIP.totalReports >= publicConfig.safeIp.reports &&
            dataIP.isPublic
        )
            return false;

        return true;
    }
};

/**
 * Check if the ip is ratelimited.
 * @param {string} ip An IP address
 * @return {Promise<string | undefined>}
 */
export const ratelimitHandler = async (ip) => {
    let familyIP = net.isIP(ip).toString();

    if (familyIP === '0') return 'Invalid IP';
    else if (familyIP === '4') familyIP = 'ipv4';
    else if (familyIP === '6') familyIP = 'ipv6';

    if (!ratelimitIPs.has(ip)) ratelimitIPs.set(ip, 1);
    else if (ratelimitIPs.get(ip) >= publicConfig.ratelimit.max)
        return 'Ratelimited';

    if (!(await ipSafe(ip))) {
        return 'Blacklisted IP';
    } else {
        return undefined;
    }
};

worker({
    ipSafe,
    ratelimitHandler,
});
