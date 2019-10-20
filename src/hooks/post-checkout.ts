import chalk from 'chalk';

import { getStoryId } from '../utils/pivotal/common';
import { shouldSkipBranchCheck } from '../utils/hooks';
import { debugLog, warning } from '../utils/console';
import { getCurrentBranch, isNewBranch } from '../utils/git';

export default function postCheckoutHook(prevHead: string, currentHead: string, checkoutType: string) {
  if (shouldSkipBranchCheck(prevHead, currentHead, checkoutType)) {
    debugLog('skipping branch check');
    return;
  }

  const branch = getCurrentBranch();
  const branchIsNew = isNewBranch(prevHead, currentHead, branch);
  const { found: hasStoryId } = getStoryId(branch);
  const showWarning = branchIsNew && !hasStoryId;

  debugLog('post-checkout flags', { branch, branchIsNew, hasStoryId, showWarning });

  if (showWarning) {
    warning(`
${chalk.inverse('[WARNING]')} A Pivotal Story ID is missing from your branch name! 🦄
Your branch:

  ${chalk.white.bold(branch)}

---

If this is your first time contributing to this repository - welcome!
Please refer to: ${chalk.underline('https://github.com/ClearTax/pivotal-flow#usage')} to get started.

${chalk.dim(`
Without the Pivotal Story ID in your branch name you would lose out on automatic updates to Pivotal stories via SCM and the commandline; some GitHub status checks might fail.

Valid sample branch names:
‣ 'feature/shiny-new-feature_12345678'
‣ 'chore/changelogUpdate_12345678'
‣ 'bugfix/fix-some-strange-bug_12345678'
`)}`);
    throw 'post-checkout: pivotal-id missing';
  }
}
