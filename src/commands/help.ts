export const getHelpOutput = () => `
Available commands in pivotal-flow:

  Check which version of pivotal-flow is installed:
  $ pivotal-flow --version

  Start working on an existing/new Pivotal story:
  $ pivotal-flow
  $ pivotal-flow start

Hooks:

  Check for Pivotal Story ID in the current branch name:
  $ pivotal-flow hook check-branch-story
  
  Check for Pivotal Story ID presence in every commit message via the
  commit-msg hook via husky:
  $ pivotal-flow hook check-commit-story

  Add Pivotal Story ID from current branch name to every commit as
  a prepare-commit-msg hook via husky:
  $ pivotal-flow hook add-story-commit
`;
