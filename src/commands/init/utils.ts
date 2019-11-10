import chalk from 'chalk';
import { writeFileSync } from 'fs';
import { homedir } from 'os';
import { resolve } from 'path';
import { cosmiconfig } from 'cosmiconfig';
import { CosmiconfigResult } from 'cosmiconfig/dist/types';

import inquirer from '../../utils/inquirer';
import { PromptToSetup, SetupAnswers, SetupQuestions } from './questions';
import { error, log } from '../../utils/console';
import PivotalClient from '../../utils/pivotal/client';
import { configFileName } from '../../utils/fs';
import { PivotalProjectResponse } from '../../utils/pivotal/types';

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
  isDefault?: boolean;
}

/**
 * Searches for pivotal flow config and returns a config array if found or returns undefined
 */
export const getPivotalFlowConfig = async (): Promise<CosmiconfigResult | void> => {
  const explorer = cosmiconfig(`${homedir()}`, { searchPlaces: [`${configFileName.PIVOTAL_CONFIG_FILE}`] });
  try {
    const pivotalFlowConfig = await explorer.search();
    if (pivotalFlowConfig) {
      return pivotalFlowConfig;
    }
  } catch (e) {
    error(`Some error occurred while creating config file!. ${e}`);
  }
};

/**
 * create and returns a config object for a given projectDetails
 * @param {PivotalProjectResponse} projectDetails
 */
export const createPivotalFlowConfig = (projectDetails: PivotalProjectResponse): PivotalFlowConfig => {
  const { name, id } = projectDetails;
  return { projectName: name, projectId: id, isDefault: true };
};

/**
 * creates a config file at user's home directory to store pivotal project ids
 * @param pivotalProjectId
 * @param pivotalToken
 */
export const createPivotalFlowConfigFile = async (pivotalProjectId: string, pivotalToken: string): Promise<void> => {
  const client = new PivotalClient({ debug: true });
  const projectDetails = await client.getProject(pivotalProjectId, pivotalToken);
  const pivotalFlowConfig = createPivotalFlowConfig(projectDetails);
  const jsonifyConfig = JSON.stringify([pivotalFlowConfig]);

  writeFileSync(resolve(homedir(), configFileName.PIVOTAL_CONFIG_FILE), jsonifyConfig, { encoding: 'utf8' });

  log(chalk`
{dim A pivotal-flow-config file has been created in your home directory}

{dim Feel free to add more project ids to the file} : {bold ~/${configFileName.PIVOTAL_CONFIG_FILE}}
      `);

  process.exit(0);
};

/**
 * Collects user input & displays setup instructions accordingly & creates a config file with given projectId.
 */
export const performSetup = async () => {
  if (!isSetupComplete()) {
    const answers = await inquirer.prompt(SetupQuestions);
    const { pivotalProjectId, pivotalToken } = answers;

    if (pivotalProjectId && pivotalToken) {
      displaySetupInstructions(answers);
      const pivotalFlowConfig = await getPivotalFlowConfig();

      if (!pivotalFlowConfig) {
        await createPivotalFlowConfigFile(pivotalProjectId, pivotalToken);
      }
    } else {
      error('Failed to set-up pivotal-flow. Please try again.');
    }
  } else {
    log(chalk`
 {bold Looks like your setup is ready!.}
 {bold You can start creating stories by running: 'pivotal-flow start'}
 `);
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
