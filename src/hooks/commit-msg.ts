import chalk from 'chalk';

import { PIVOTAL_ID_IN_STRING } from '../regex';
import { readFile } from '../utils/fs';
import { warning } from '../utils/console';

export default async function commitMsgHook(commitMessageFilename: string) {
  const commitMessage = await readFile(commitMessageFilename, { encoding: 'utf8' });

  if (!PIVOTAL_ID_IN_STRING.test(commitMessage)) {
    warning(`
${chalk.inverse('[WARNING]')} A Pivotal Story ID is missing from your commit message! 🦄

Your commit message:

${chalk.white.bold(commitMessage)}
---

If this is your first time contributing to this repository - welcome!
Please refer to: ${chalk.underline('https://github.com/ClearTax/pivotal-flow#usage')} to get started.

${chalk.dim(`
Without the Pivotal Story ID in your commit message, you would lose out on automatic updates to Pivotal stories when pushing your branch to the remote.

Use '${chalk.underline('pivotal-flow hook prepare-commit-msg')}' to automate this for you.
`)}`);
    throw 'commit-msg: failed to find pivotal id in commit message';
  }
}
