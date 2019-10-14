import { Command } from 'commander';

const addHelp = async (program: Command) => {
  program.on('--help', () =>
    console.log(
      `
Available commands in pivotal-flow:

  Check which version of pivotal-flow is installed:
  $ pivotal-flow --version

  Start working on an existing/new Pivotal story:
  $ pivotal-flow
  $ pivotal-flow start

Hooks:

  Check for Pivotal Story ID in the current branch name:
  $ pivotal-flow check-branch

  Add Pivotal Story ID from current branch name to every commit as
  a prepare-commit-msg hook via husky:
  $ pivotal-flow prepare-commit-msg

  Check for Pivotal Story ID presence in every commit message via the
  commit-msg hook via husky:
  $ pivotal-flow prepare-commit-msg`
    )
  );
};

export default addHelp;
