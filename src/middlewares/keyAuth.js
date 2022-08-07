/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
/** @typedef {import('express').NextFunction} NextFunc */

import {redis} from '../redis.js';

/**
 * key auth middleware.
 * @param {Request} req - Express request object.
 * @param {Response} res - response object
 * @param {NextFunc} next - next middleware
 * @return {Promise<void>}
 */
export const keyAuthMiddleware = async (req, res, next) => {
    const apiCredKey = await redis.get('api_credential_key');
    if (typeof apiCredKey !== 'string') {
        return res.status(401).json({
            message: 'API credential key is not set.',
        });
    } else if (req.headers['x-api-key'] !== apiCredKey) {
        return res.status(401).json({
            message: 'API credential key is invalid.',
        });
    } else {
        return next();
    }
};
