import { HookOptions } from '../models/hooks';
import { debugLogObject, debugLog } from './console';
import { inDetachedHeadState } from './git';
import { getStoryId } from './pivotal/common';

/**
 * Parse params of hooks based on environment variable name provided
 * via the commander options.
 */
export const parseHookParams = (options: HookOptions) => {
  const { E = 'HUSKY_GIT_PARAMS' } = options;
  const params = (process.env[E] || '').trim();
  if (!params) {
    throw new TypeError(`Missing hook parameters. Try running the hook via husky or any other hook-runner.`);
  }
  return params.split(' ');
};

/**
 * Skip the check in certain situations:-
 * - when checking out a file
 * - when checking out to a SHA
 */
export const shouldSkipBranchCheck = (
  /* checkout out from */
  prevHead: string,
  /* checkout out to */
  currentHead: string,
  /* checkoutType is 0 when it's a file checkout */
  checkoutType: string
) => {
  if (checkoutType !== '1') {
    debugLogObject('skipped due to checkoutType', { checkoutType });
    return true;
  }

  debugLogObject('head references', { prevHead, currentHead });

  if (prevHead === currentHead) {
    debugLog('skipped due same prevHead & currentHead');
    return true;
  }

  // if we're in a detached head state (eg. submodule checkout or rebase)
  const detachedState = inDetachedHeadState();
  debugLogObject('inDetachedHeadState?', { detachedState });

  return detachedState;
};

/**
 * Skip the hook when
 *  - source is a commit (eg. amend)
 * @example shouldSkipPrepareCommitMessage('.git/COMMIT_EDITMSG', 'message') => false
 * @example shouldSkipPrepareCommitMessage('.git/COMMIT_EDITMSG', 'commit') => true // git amend
 */
export const shouldSkipPrepareCommitMessage = (
  /** Path to commit-msg file */
  _: string,
  /** 'commit' | 'message' */
  source: string
) => source == 'commit';

/**
 * * Append story id to given commit message.
 */
export const appendStoryIdToCommitMessage = (
  /** Original Commit Message */
  message: string,
  /** Story id extracted from the branch. */
  storyId: string
) => {
  const { found: foundInOriginalMessage, formatted: existingStoryId } = getStoryId(message);

  if (foundInOriginalMessage) {
    debugLogObject('skipping - story id already present', {
      foundInOriginalMessage,
      message,
      storyId,
      existingStoryId,
    });
    return message;
  }

  const messageWithId = [message, '---', `[${storyId}]`].join('\n');
  debugLogObject('appended to the commit message', { message: messageWithId });
  return messageWithId;
};
