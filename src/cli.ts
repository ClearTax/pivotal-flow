#!/usr/bin/env node

import { Command } from 'commander';

import addVersion from './commands/version';
import addHelp from './commands/help';

(async () => {
  const program = new Command();

  program.name('pivotal-flow').description(`Automate your pivotal workflow.`);

  // add global options
  program.option('--debug', 'Debug pivotal-flow');
  await addVersion(program);
  await addHelp(program);

  // add commands
  program.command('init', 'Set-up pivotal-flow', { executableFile: './commands/init/index' });

  program
    .command('start', 'Start working on a story', { executableFile: './commands/start/index', isDefault: true })
    .alias('s');

  // parse at the end
  program.parse(process.argv);

  if (program.debug) console.log(program.opts());
})();
