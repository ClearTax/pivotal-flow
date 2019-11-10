import { promisify } from 'util';
import fs from 'fs';

export const readFile = promisify(fs.readFile);

export enum configFileName {
  PIVOTAL_CONFIG_FILE = '.pivotal-flow-config.json',
}
