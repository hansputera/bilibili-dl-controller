import workerpool from 'workerpool';
import {resolve} from 'node:path';
import {getDirname} from './util.js';

/**
 * Returns the workerpool.
 * @param {string} workername The name of the worker.
 * @param {workerpool.WorkerPoolOptions} options The options for the workerpool.
 * @return {workerpool.WorkerPool}
 */
export const getWorker = (workername, options) =>
    workerpool.pool(
        resolve(getDirname(import.meta), 'workers', workername.concat('.js')),
        options,
    );
