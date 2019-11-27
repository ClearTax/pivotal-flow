/**
 * @see [moduleName](https://github.com/davidtheclark/cosmiconfig#modulename)
 */
export const COSMICONFIG_MODULE_NAME = 'pivotal-flow';

/**
 * Keeping this similar to `lint-staged`.
 * https://github.com/okonet/lint-staged/blob/6af83070c44003477c00d4c088806af23333ec59/src/index.js#L24-L31
 */
export const COSMICONFIG_SEARCH_PLACES = [
  '.pivotalflowrc',
  '.pivotalflowrc.json',
  '.pivotalflowrc.yaml',
  '.pivotalflowrc.yml',
  '.pivotalflowrc.js',
  'pivotal-flow.config.js',
];

/**
 * Use the first thing that is searched as the default filename.
 * In this case `.pivotalflowrc`
 */
export const DEFAULT_CONFIG_FILE_NAME = COSMICONFIG_SEARCH_PLACES[0];
