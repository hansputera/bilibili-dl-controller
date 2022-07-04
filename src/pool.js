import workerpool from 'workerpool';
import {resolve} from 'node:path';
import {getDirname} from './util.js';

/**
 * Returns the workerpool.
 * @param {string} workername The name of the worker.
 * @return {workerpool.WorkerPool}
 */
export const getWorker = (workername) =>
    workerpool.pool(
        resolve(getDirname(import.meta), 'workers', workername.concat('.js')),
    );
