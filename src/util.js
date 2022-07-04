import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

/**
 * Returns the dirname path.
 * @param {import.meta} meta 'import.meta' structure.
 * @return {string}
 */
export const getDirname = (meta) => dirname(getFileName(meta));

/**
 * Returns the filename.
 * @param {import.meta} meta 'import.meta' structure.
 * @return {string}
 */
export const getFileName = (meta) => (meta.url ? fileURLToPath(meta.url) : '');
