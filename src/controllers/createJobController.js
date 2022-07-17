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
        if (typeof req.body !== 'object') return res.status(400).json({
            message: 'I need an object!',
        });
        else if (typeof req.body?.job !== 'string') return res.status(400).json({
            message: 'The request payload is an object, but, can you fill the "job" ?',
        });
        else if (typeof req.body?.payload === 'undefined') return res.status(400).json({
            message: 'Sorry, can you fill the "payload" ?',
        });
        /** @type {Job} */
        const job = await req.app.settings['bull_queue'].add(req.body.job, req.body.payload);

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
