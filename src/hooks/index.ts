import { HookOptions } from '../models/hooks';
import { error } from '../utils/console';

import { parseHookParams } from '../utils/hooks';

// hooks
import recordParams from './record-params';

const handlers: { [k: string]: Function } = {
  'record-params': recordParams,
};

export default async function(hookType: string, options: HookOptions) {
  try {
    if (typeof handlers[hookType] !== 'function') {
      throw new Error(`Invalid hook: ${hookType}`);
    }

    const params = parseHookParams(options);
    await handlers[hookType](...params);
  } catch (e) {
    error(e);
    process.exit(1);
  }

  process.exit(0);
}
