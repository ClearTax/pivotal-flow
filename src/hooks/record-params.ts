import { debugLogObject } from '../utils/console';

/**
 * Use this to test what params you receive when executing a hook & then add them to test cases
 * @example "pre-commit": "HUSKY_DEBUG=1 pivotal-flow hooks record-params"
 */
const recordParams = (...params: string[]) => {
  debugLogObject('params', { params });
};

export default recordParams;
