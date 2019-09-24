const chalk = require('chalk');

const { shouldSkipBranchCheck } = require('./utils');
const { getCurrentBranch, isNewBranch } = require('../../utils/git');
const { getStoryId } = require('../../utils/pivotal');
const { logObject, log } = require('../../utils/common');

module.exports = (prevHead, currentHead, checkoutType) => {
  logObject('\npost-checkout inputs', { prevHead, currentHead, checkoutType });

  if (shouldSkipBranchCheck(prevHead, currentHead, checkoutType)) {
    log('skipped branch check');
    process.exit(0);
  }

  const branchName = getCurrentBranch();
  const newBranch = isNewBranch(prevHead, currentHead, branchName);
  const { found: hasStoryId } = getStoryId(branchName);
  const showWarning = newBranch && !hasStoryId;

  logObject('intermediate flags', { branchName, isNewBranch: newBranch, hasStoryId, showWarning });

  if (showWarning) {
    console.log(
      chalk.yellow(`
${chalk.inverse('[WARNING]')} A Pivotal Story ID is missing from your branch name! 🦄
Your branch: ${chalk.white.bold(branchName)}

If this is your first time contributing to this repository - welcome!
Please refer to: ${chalk.underline('https://github.com/ClearTax/pivotal-flow#usage')} to get started.

---
${chalk.dim(`
Without the Pivotal Story ID in your branch name you would lose out on automatic updates to Pivotal stories via SCM and the commandline;
some GitHub status checks might fail.

Valid sample branch names:
‣ 'feature/shiny-new-feature_12345678'
‣ 'chore/changelogUpdate_12345678'
‣ 'bugfix/fix-some-strange-bug_12345678'
`)}`)
    );
    process.exit(1);
  }

  process.exit(0);
};
