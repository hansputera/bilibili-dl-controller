import {publicConfig} from '../../public-config.js';
import {ratelimitIPs} from '../stores/ratelimitIPs.js';

/** @typedef {import('ioredis').Redis} Redis */

/**
 * Save IP to redis.
 * @param {Redis} redisConn A redis connection
 * @return {NodeJS.Timeout} A timeout
 */
export const saveIP = async (redisConn) => {
    return setTimeout(() => {
        redisConn.set(
            'ratelimited_ips',
            JSON.stringify(Object.fromEntries(ratelimitIPs.entries())),
        );
    }, publicConfig.ratelimit.save_time);
};
