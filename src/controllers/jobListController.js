/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/** @typedef {import('bullmq').Job} Job */

/**
 * Job List controller
 * @param {Request} req - Express request object.
 * @param {Response} res - response object
 * @return {Promise<void>}
 */
export const jobListController = async (req, res) => {
    /** @type {Job[]} */
    const jobs = await req.app.settings['bull_queue'].getJobs();
    return res.status(200).json(
        jobs.map((j) => ({
            id: j.data.identifier,
            status: j.finishedOn
                ? j.failedReason
                    ? 'failed'
                    : 'finished'
                : j.failedReason
                ? 'failed'
                : 'progress',
            failedReason: j.failedReason,
            bullMQId: j.id,
        })),
    );
};
