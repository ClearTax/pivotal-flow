import chalk from 'chalk';
import { writeFileSync } from 'fs';
import { homedir } from 'os';
import { resolve } from 'path';

import inquirer from '../../utils/inquirer';
import { PromptToSetup, SetupAnswers, SetupQuestions } from './questions';
import { error, log } from '../../utils/console';
import PivotalClient from '../../utils/pivotal/client';
import { checkIfConfigFileExists, configFileName } from '../../utils/fs';
import { GetProjectDetailsResponse } from '../../utils/pivotal/types';

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

export interface PivotalFlowConfig {
  projectName: string;
  projectId: number;
  default?: boolean;
}

/**
 * create and returns a config object for a given projectDetails
 * @param {GetProjectDetailsResponse} projectDetails
 */

export const createPivotalFlowConfig = (projectDetails: GetProjectDetailsResponse): PivotalFlowConfig => {
  const { name, id } = projectDetails;
  return { projectName: name, projectId: id, default: true };
};

/**
 * creates a config file at user's home directory to store pivotal project ids
 * @param pivotalProjectId
 */
export const createPivotalFlowConfigFile = async (pivotalProjectId: string): Promise<void> => {
  const client = new PivotalClient({ debug: true });
  const projectDetails = await client.getProjectDetails(pivotalProjectId);
  const pivotalFlowConfig = createPivotalFlowConfig(projectDetails);
  const jsonifyConfig = JSON.stringify([pivotalFlowConfig]);

  writeFileSync(resolve(homedir(), configFileName.PIVOTAL_CONFIG_FILE), jsonifyConfig, { encoding: 'utf8' });

  log(chalk`
{dim A pivotal-flow-config file has been created in your home directory}

{dim Feel free to add more project ids to the file} : {bold ~/${configFileName.PIVOTAL_CONFIG_FILE}}
      `);

  process.exit();
};

/**
 * Collects user input & displays setup instructions accordingly & creates a config file with given projectId.
 */
export const performSetup = async () => {
  const answers = await inquirer.prompt(SetupQuestions);
  const { pivotalProjectId, pivotalToken } = answers;

  if (pivotalProjectId && pivotalToken) {
    displaySetupInstructions(answers);
    if (!checkIfConfigFileExists()) {
      await createPivotalFlowConfigFile(pivotalProjectId);
    }
  } else {
    error('Failed to set-up pivotal-flow. Please try again.');
  }
};

/**
 * Aborts if pivotal-flow has not been set-up. Displays setup instructions before aborting.
 */
export const abortIfNotSetup = async () => {
  if (!isSetupComplete()) {
    const { wantSetup } = await inquirer.prompt(PromptToSetup);
    if (wantSetup) {
      await performSetup();
    } else {
      error(`Setup for pivotal-flow incomplete. Please try again after running 'pivotal-flow init'.`);
    }
    // return non-zero error code when set-up is not completed.
    process.exit(wantSetup ? 0 : 1);
  } else {
    return;
  }
};
