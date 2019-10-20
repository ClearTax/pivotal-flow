import { HookOptions } from '../models/hooks';
import { debugLogObject } from '../utils/console';

import { parseHookParams } from '../utils/hooks';

// hooks
import recordParams from './record-params';
import commitMsg from './commit-msg';
import postCheckout from './post-checkout';
import prepareCommitMsg from './prepare-commit-msg';

const handlers: { [k: string]: Function } = {
  'record-params': recordParams,
  'commit-msg': commitMsg,
  'post-checkout': postCheckout,
  'prepare-commit-msg': prepareCommitMsg,
};

export default function(hookType: string, options: HookOptions) {
  try {
    debugLogObject('hook-runner', { hookType });

    if (typeof handlers[hookType] !== 'function') {
      throw new Error(`Invalid hook: ${hookType}`);
    }

    const params = parseHookParams(options);
    handlers[hookType](...params);
  } catch (e) {
    debugLogObject('error running hook', e);
    process.exit(1);
  }

  process.exit(0);
}
