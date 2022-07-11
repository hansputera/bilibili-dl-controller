import {ratelimitWorker} from '../pool.js';
import {redis} from '../redis.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
/** @typedef {import('express').NextFunction} NextFunc */

/**
 * ratelimit middleware.
 * @param {Request} req - Express request object.
 * @param {Response} res - response object
 * @param {NextFunc} next - next middleware
 * @return {Promise<void>}
 */
export const ratelimitMiddleware = async (req, res, next) => {
    let ip = req.ip;
    if (typeof req.headers['x-payload'] === 'string') {
        ip = Buffe.from(req.headers['x-payload']).toString('utf8');
    }

    if (
        ip === '::ffff:' ||
        ip === '::1' ||
        ip === 'localhost' ||
        ip === '127.0.0.1'
    ) {
        return next();
    }

    const blacklistedIPs = await redis
        .get('ratelimit_ips')
        .then((ips) => (typeof ips === 'string' ? JSON.parse(ips) : []))
        .catch(() => []);

    if (!blacklistedIPs || blacklistedIPs.indexOf(ip) !== -1) {
        return res.status(403).json({
            message: 'You are blacklisted.',
        });
    }

    const result = await ratelimitWorker.exec('ratelimitHandler', [ip]);
    if (/blacklisted/gi.test(result)) {
        await redis.set(
            'blacklisted_ips',
            JSON.stringify([...blacklistedIPs, ip]),
        );
        return res.status(403).json({
            message: 'You are blacklisted.',
        });
    } else {
        if (result) return res.status(401).json({message: result});
        return next();
    }
};
