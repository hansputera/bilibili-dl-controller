/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/** @typedef {import('bullmq').Job} Job */

/**
 * Job creator controller.
 * @param {Request} req - Express request object.
 * @param {Response} res - response object
 * @return {Promise<void>}
 */
export const jobCreateController = async (req, res) => {
    try {
        /** @type {Job} */
        const job = await req.app.settings['bull_queue'].add('downloader', {
            audioUrl: req.body.audioUrl,
            videoUrl: req.body.videoUrl,
            identifier: req.body.identifier,
        });

        if (req.query.wait) {
            const result = await job
                .waitUntilFinished(req.app.settings['bull_events'], 10_000)
                .catch((e) => e);

            return res.status(200).json({
                identifier: req.body.identifier,
                jobId: job.id,
                q: job.queueName,
                data: result,
            });
        }

        return res.status(200).json({
            identifier: req.body.identifier,
            jobId: job.id,
            q: job.queueName,
        });
    } catch (e) {
        return res.status(500).json({
            error: e.message,
        });
    }
};
