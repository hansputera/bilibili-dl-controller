import joi from 'joi';

/**
 * Download API Validator.
 * @return {joi.Schema}
 */
export const getDownloadValidator = () =>
    joi.compile(
        joi.object({
            audioUrl: joi.string().uri().required(),
            videoUrl: joi.string().uri().required(),
            identifier: joi.number().required(),
        }),
    );
