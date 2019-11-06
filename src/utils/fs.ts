import { promisify } from 'util';
import fs, { existsSync } from 'fs';
import { homedir } from 'os';

export const readFile = promisify(fs.readFile);

export enum configFileName {
  PIVOTAL_CONFIG_FILE = '.pivotal-flow-config.json',
}

/**
 * Checks if pivotal-flow-config file exists at user's home directory
 */
export const checkIfConfigFileExists = (): boolean => {
  return existsSync(`${homedir()}/${configFileName.PIVOTAL_CONFIG_FILE}`);
};
