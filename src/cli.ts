#!/usr/bin/env node

import { Command } from 'commander';

import addVersion from './commands/version';
import addHelp from './commands/help';

// import pivotalFlow from './pivotal-flow';

(async () => {
  const program = new Command();

  program.name('pivotal-flow').description(`Automate your pivotal workflow.`);

  // add global options
  program.option('--debug', 'Debug pivotal -flow');
  await addVersion(program);
  await addHelp(program);

  // add commands
  program.command('init', 'Set-up pivotal-flow', { executableFile: './commands/init/index' });
  // .command('start', 'Start working on Pivotal Story', { executableFile: './commands/start', isDefault: true })
  // .alias('s');

  // parse at the end
  program.parse(process.argv);

  if (program.debug) console.log(program.opts());
})();
