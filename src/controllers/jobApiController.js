/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/** @typedef {import('bullmq').Job} Job */

/**
 * Job API controller.
 * @param {Request} req - Express request object.
 * @param {Response} res - response object
 * @return {Promise<void>}
 */
export const jobApiController = async (req, res) => {
    /** @type {Job} */
    const job = req.app.settings['bull_queue'].getJob(req.params.id);
    if (!job) {
        return res.status(404).json({
            message: 'Job not found',
        });
    }
    if (job && !job.returnvalue && job.finishedOn) {
        job.remove();
        return res.status(404).json({
            message: "It's failed job, please retry",
        });
    }

    return res.status(200).json(
        job.returnvalue
            ? {
                  status: 'progress',
                  ...job.data,
              }
            : {
                  status: 'finished',
                  ...job.returnvalue,
              },
    );
};
