#!/usr/bin/env node

import { Command } from 'commander';

import addVersion from './commands/version';
import addHelp from './commands/help';

// import pivotalFlow from './pivotal-flow';

(async () => {
  const program = new Command();

  program.name('pivotal-flow').usage('[command] [options]');

  // add global options
  program.option('--debug', 'Debug pivotal -flow');

  await addVersion(program);
  await addHelp(program);

  program.parse(process.argv);

  if (program.debug) console.log(program.opts());
})();
