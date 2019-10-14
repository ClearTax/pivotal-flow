import { Command } from 'commander';
import { resolve } from 'path';

import { readFile } from '../utils/fs';

const addVersion = async (program: Command) => {
  const packageJsonPath = resolve(__dirname, '../..', 'package.json');
  const packageJson = JSON.parse(await readFile(packageJsonPath, { encoding: 'utf-8' }));

  program.version(packageJson.version);
};

export default addVersion;
