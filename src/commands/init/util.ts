import chalk from 'chalk';

import inquirer from '../../utils/inquirer';
import { PromptToSetup, SetupQuestions, SetupAnswers } from './questions';
import { log, error } from '../../utils/console';

export const isSetupComplete = () => !!(process.env.PIVOTAL_TOKEN && process.env.PIVOTAL_PROJECT_ID);

const displaySetupInstructions = ({ pivotalToken, pivotalProjectId }: SetupAnswers) =>
  log(chalk`
To get started with pivotal-flow, run the following commands in your current terminal session:-

  {bold export PIVOTAL_TOKEN=${pivotalToken}}
  {bold export PIVOTAL_PROJECT_ID=${pivotalProjectId}}

{dim.italic You can also add them to your profile (~/.bash_profile, ~/.zshrc, ~/.profile, or ~/.bashrc) so the environment variables are automatically added for all new terminal sessions.}
`);

export const performSetup = async () => {
  const answers = await inquirer.prompt(SetupQuestions);
  const { pivotalProjectId, pivotalToken } = answers;

  if (pivotalProjectId && pivotalToken) {
    displaySetupInstructions(answers);
  } else {
    error('Failed to set-up pivotal-flow. Please try again.');
  }
};

export const promptSetup = async () => {
  if (!isSetupComplete()) {
    const { wantSetup } = await inquirer.prompt(PromptToSetup);
    if (wantSetup) {
    }
  }
};
