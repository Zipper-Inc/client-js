import pkgJson from '../package.json' assert { type: 'json' };
export const __VERSION__ = pkgJson.version;
export const DEFAULT_ZIPPER_DOT_RUN_HOST = 'zipper.run';
export const LOG_PREFIX = `[@zipper-inc/client-js]`;
