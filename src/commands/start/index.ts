#!/usr/bin/env node
import { Command } from 'commander';
import { abortIfNotSetup } from '../init/util';

(async () => {
  const program = new Command();
  program.name('start');

  program.option('-n, --new', 'create a new story & start working on it');
  program.parse(process.argv);

  await abortIfNotSetup();

  // console.log('doing something', process.env.PIVOTAL_PROJECT_ID, process.env.PIVOTAL_TOKEN);
})();
