import chalk from 'chalk';
import { homedir } from 'os';
import { join } from 'path';
import { cosmiconfig } from 'cosmiconfig';

// other utils
import inquirer from '../../utils/inquirer';
import { error, log } from '../../utils/console';
import PivotalClient from '../../utils/pivotal/client';
import { PivotalProjectResponse } from '../../utils/pivotal/types';
import { writeFile } from '../../utils/fs';

// constants & types
import { COSMICONFIG_MODULE_NAME, COSMICONFIG_SEARCH_PLACES, DEFAULT_CONFIG_FILE_NAME } from './constants';
import { PromptToSetup, SetupQuestions } from './questions';
import { Configuration, ConfigResult } from './types';

/**
 * Searches for pivotal flow config and returns a config if found or returns undefined
 */
export const getPivotalFlowConfig = async (): Promise<Configuration | null> => {
  const explorer = cosmiconfig(COSMICONFIG_MODULE_NAME, {
    searchPlaces: COSMICONFIG_SEARCH_PLACES,
  });
  try {
    const result = (await explorer.search()) as ConfigResult;
    if (result && !result.isEmpty) {
      return result.config;
    }
    return null;
  } catch (e) {
    error(`Some error occurred while creating the config file, Please try again!. ${e}`);
    return null;
  }
};

/**
 * Checks for config object and required configs are exits or not
 */
export const isSetupComplete = async (): Promise<boolean> => {
  const config = await getPivotalFlowConfig();

  if (config) {
    const { pivotalApiToken, projects } = config;
    return Boolean(pivotalApiToken && projects && projects.length >= 1);
  }
  return false;
};

/**
 * create and returns a config object for a given projectDetails
 * @param {PivotalProjectResponse} projectDetails
 * @param apiToken
 */
export const getBasicConfiguration = (projectDetails: PivotalProjectResponse, apiToken: string): Configuration => {
  const { name, id } = projectDetails;
  return { projects: [{ name, id }], pivotalApiToken: apiToken };
};

/**
 * creates a config file at user's home directory to store pivotal projects and API token
 * @param projectId
 * @param apiToken
 */
export const createPivotalFlowConfigFile = async (projectId: string, apiToken: string): Promise<void> => {
  const client = new PivotalClient({ projectId, apiToken });
  const projectDetails = await client.getProject();

  const config = getBasicConfiguration(projectDetails, apiToken);
  const filePath = join(homedir(), DEFAULT_CONFIG_FILE_NAME);

  await writeFile(filePath, JSON.stringify(config, null, 2), { encoding: 'utf8' });

  log(chalk`
A basic configuration file has been created for you in your home directory:-
  {bold ${filePath}}

Find more details about addding/changing the configuration options here:
  {underline https://github.com/ClearTax/pivotal-flow#configuration}
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
{bold Looks like your setup is ready!}
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
