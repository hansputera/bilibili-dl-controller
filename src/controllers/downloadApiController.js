import {getDownloadValidator} from '../validators/download.validator.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/** @typedef {import('bullmq').Job} Job */

/**
 * Download API controller.
 * @param {Request} req - Express request object.
 * @param {Response} res - response object
 * @return {Promise<void>}
 */
export const downloadApiController = async (req, res) => {
    try {
        await getDownloadValidator().validateAsync(req.body);

        /** @type {Job} */
        const job = await req.app.settings['bull_queue'].add('downloader', {
            audioUrl: req.body.audioUrl,
            videoUrl: req.body.videoUrl,
            identifier: req.body.identifier,
        });

        return res.status(200).json({
            identifier: req.body.identifier,
            jobId: job.id,
            q: job.queueName,
        });
    } catch (e) {
        return res.status(e.name === 'ValidationError' ? 400 : 500).json({
            error: e.message,
            details: e.details,
        });
    }
};
