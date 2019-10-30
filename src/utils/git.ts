import { execSync } from 'child_process';
import { resolve } from 'path';

import { readFileSync, writeFileSync } from 'fs';
import { debugLogObject } from './console';

/**
 * Get root directory of the project (where the .git folder exists)
 */
export const getRootDirectory = () =>
  execSync('git rev-parse --show-toplevel')
    .toString()
    .trim();

/**
 * Get current branch name as a string.
 */
export const getCurrentBranch = () => {
  const branchName = execSync('git rev-parse --abbrev-ref HEAD')
    .toString()
    .trim();
  return branchName;
};

/**
 * Detect if currently in detached-HEAD state.
 *
 * @see https://stackoverflow.com/a/52222248/4101408
 * @see https://www.git-tower.com/learn/git/faq/detached-head-when-checkout-commit
 */
export const inDetachedHeadState = () => {
  try {
    execSync('git symbolic-ref -q HEAD');
    return false;
  } catch (error) {
    return true;
  }
};

/**
 * Get count of how many times a particular ref is checked out.
 */
export const getCheckoutCount = (
  /** The git `ref` to check */
  ref = ''
): number => {
  const count = execSync(`git reflog --date=local | grep -o '${ref}' | wc -l`, { encoding: 'utf-8' }).trim();
  debugLogObject('checkout count', { count, ref });
  return parseInt(count, 10);
};

/**
 * Check if the checked out branch is a new branch.
 */
export const isNewBranch = (prevHead: string, currentHead: string, branch: string) =>
  prevHead === currentHead && getCheckoutCount(branch || '') === 1;

export const checkoutNewBranch = (branchName: string) => execSync(`git checkout -b ${branchName}`);

/**
 * Get contents of commit message file
 */
export const getCommitMessage = (filename: string) => readFileSync(filename, { encoding: 'utf8' });

/**
 * Write the final commit message to the filename provided.
 */
export const writeCommitMessage = (filename: string, message: string) => {
  const gitRootDirectory = getRootDirectory();
  return writeFileSync(resolve(gitRootDirectory, filename), message, { encoding: 'utf8' });
};
