import chalk from 'chalk';
import { writeFileSync } from 'fs';
import { homedir } from 'os';
import { resolve } from 'path';
import { cosmiconfig } from 'cosmiconfig';
import { Config } from 'cosmiconfig/dist/types';

import inquirer from '../../utils/inquirer';
import { PromptToSetup, SetupQuestions } from './questions';
import { error, log } from '../../utils/console';
import PivotalClient from '../../utils/pivotal/client';
import { configFileName } from './constants';
import { PivotalProjectResponse } from '../../utils/pivotal/types';

export interface PivotalProjectConfig {
  projectName: string;
  projectId: number;
}

export interface PivotalFlowConfig extends Config {
  pivotalApiToken: string;
  projects: PivotalProjectConfig[];
}

/**
 * Searches for pivotal flow config and returns a config if found or returns undefined
 */
export const getPivotalFlowConfig = async (): Promise<PivotalFlowConfig | void> => {
  const explorer = cosmiconfig(`${homedir()}`, { searchPlaces: [`${configFileName.PIVOTAL_CONFIG_FILE}`] });
  try {
    const pivotalFlowConfig = await explorer.search();
    if (pivotalFlowConfig) {
      return pivotalFlowConfig.config;
    }
  } catch (e) {
    error(`Some error occurred while creating the config file, Please try again!. ${e}`);
  }
};

/**
 * Checks for config objects and required configs are exits or not
 */
export const isSetupComplete = async (): Promise<boolean> => {
  const config = await getPivotalFlowConfig();

  if (config && Array.isArray(config)) {
    const [configObject] = config;
    const { pivotalApiToken, projects } = configObject;
    return Boolean(pivotalApiToken && projects && projects.length >= 1);
  }
  return false;
};

/**
 * create and returns a config object for a given projectDetails
 * @param {PivotalProjectResponse} projectDetails
 * @param apiToken
 */
export const createPivotalFlowConfig = (
  projectDetails: PivotalProjectResponse,
  apiToken: string
): PivotalFlowConfig => {
  const { name: projectName, id: projectId } = projectDetails;
  return { projects: [{ projectName, projectId }], pivotalApiToken: apiToken };
};

/**
 * creates a config file at user's home directory to store pivotal projects and API token
 * @param projectId
 * @param apiToken
 */
export const createPivotalFlowConfigFile = async (projectId: string, apiToken: string): Promise<void> => {
  const client = new PivotalClient({ debug: true, projectId, apiToken });
  const projectDetails = await client.getProject();
  const pivotalFlowConfig = createPivotalFlowConfig(projectDetails, apiToken);
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
  if (!(await isSetupComplete())) {
    const answers = await inquirer.prompt(SetupQuestions);
    const { pivotalProjectId, pivotalToken } = answers;

    try {
      await createPivotalFlowConfigFile(pivotalProjectId, pivotalToken);
    } catch (e) {
      error(`Failed to set-up pivotal-flow. Please try again. ${e}`);
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
  if (!(await isSetupComplete())) {
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
