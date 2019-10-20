import { HookOptions } from '../models/hooks';

export const parseHookParams = (options: HookOptions) => {
  const { E = 'HUSKY_GIT_PARAMS' } = options;
  const params = (process.env[E] || '').trim();
  if (!params) {
    throw new TypeError(`Missing hook parameters. Try running the hook via husky or any other hook-runner.`);
  }
  return params.split(' ');
};
