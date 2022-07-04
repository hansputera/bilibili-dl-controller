import got from 'got';
import {worker} from 'workerpool';

/**
 * Check if the ip is safe.
 * @param {string} ip An IP address
 * @return {Promise<boolean>}
 */
export const ipSafe = async (ip) => {
    const data = await got('https://api.abuseipdb.com/api/v2/check', {
        searchParams: {
            maxAgeInDays: 120,
        },
        body: new URLSearchParams({
            ipAddress: ip,
        }),
        headers: {
            Key: process.env.ABUSEIP_DB_KEY,
            Accept: 'application/json',
        },
    })
        .json()
        .catch(() => undefined);

    if (!data) return false;
    else {
        const dataIP = data.data;
        if (
            dataIP.isWhitelisted &&
            dataIP.abuseConfidenceScore >= 60 &&
            dataIP.totalReports >= 3
        )
            return false;

        return true;
    }
};

worker({
    ipSafe,
});
