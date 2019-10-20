import { getStoryIfFromCurrentBranch } from '../utils/pivotal/common';
import { shouldSkipPrepareCommitMessage, appendStoryIdToCommitMessage } from '../utils/hooks';
import { debugLogObject, debugLog } from '../utils/console';
import { getCommitMessage, writeCommitMessage } from '../utils/git';

export default function prepareCommitMsgHook(filename: string, source: string, sha: string) {
  if (shouldSkipPrepareCommitMessage(filename, source)) {
    debugLogObject('skipped prepare-commit-msg', { filename, source, sha });
  }

  const original = getCommitMessage(filename);
  const { found, formatted: storyId } = getStoryIfFromCurrentBranch();

  if (!found) {
    debugLog('skipped prepare-commit-msg - story ID not found in branch name');
    return;
  }

  debugLogObject('story details from branch', { found, storyId });

  const preparedMessage = appendStoryIdToCommitMessage(original, storyId);
  return writeCommitMessage(filename, preparedMessage);
}
