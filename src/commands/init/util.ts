import chalk from 'chalk';

import inquirer from '../../utils/inquirer';
import { PromptToSetup, SetupQuestions, SetupAnswers } from './questions';
import { log, error } from '../../utils/console';

export const isSetupComplete = () => !!(process.env.PIVOTAL_TOKEN && process.env.PIVOTAL_PROJECT_ID);

/**
 * Displays the instructions based on user's answers.
 * @param {SetupAnswers} answers - Setup prompt answers
 */
const displaySetupInstructions = ({ pivotalToken, pivotalProjectId }: SetupAnswers) =>
  log(chalk`
To get started with pivotal-flow, run the following commands in your current terminal session:-

  {bold export PIVOTAL_TOKEN=${pivotalToken}}
  {bold export PIVOTAL_PROJECT_ID=${pivotalProjectId}}

{dim.italic You can also add them to your profile (~/.bash_profile, ~/.zshrc, ~/.profile, or ~/.bashrc) so the environment variables are automatically added for all new terminal sessions.}
`);

const addToCurrentEnvironment = ({ pivotalToken, pivotalProjectId }: SetupAnswers) => {
  process.env.PIVOTAL_TOKEN = pivotalToken;
  process.env.PIVOTAL_PROJECT_ID = pivotalProjectId;
};

/**
 * Collects user input & displays setup instructions accordingly.
 */
export const performSetup = async () => {
  const answers = await inquirer.prompt(SetupQuestions);
  const { pivotalProjectId, pivotalToken } = answers;

  if (pivotalProjectId && pivotalToken) {
    addToCurrentEnvironment(answers);
    displaySetupInstructions(answers);
  } else {
    error('Failed to set-up pivotal-flow. Please try again.');
  }
};

/**
 * Prompts the user to setup pivotal-flow if it has not already been set-up.
 * Returns true if set-up is already complete or gets completed as part of this function.
 * Returns false if the user cancels setup.
 */
export const promptSetup = async () => {
  if (!isSetupComplete()) {
    const { wantSetup } = await inquirer.prompt(PromptToSetup);
    if (wantSetup) {
      await performSetup();
      return true;
    }
    return false;
  }
  return true;
};

/**
 * Checks if pivotal-flow was set up, & prompts the user to setup if it has not been performed.
 * Aborts the process if the user chooses not to perform setup.
 */
export const abortIfNotSetup = async () => {
  const done = await promptSetup();
  if (!done) {
    error(`Setup for pivotal-flow incomplete. Please try again after running 'pivotal-flow init'.`);
    process.exit(0);
  }
};
