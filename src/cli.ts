#!/usr/bin/env node

import { Command } from 'commander';

import { getHelpOutput } from './commands/help';
import getVersion from './commands/version';

(async () => {
  const program = new Command();

  program.name('pivotal-flow').description(`Automate your pivotal workflow.`);

  // add global options
  program.version(await getVersion());
  program.on('--help', () => console.log(getHelpOutput()));

  // add commands
  program.command('init', 'Set-up pivotal-flow', { executableFile: './commands/init/index' });

  program
    .command('hook <type>', 'Execute a hook (via husky)', { executableFile: './commands/hook/index' })
    .command('start', 'Start working on a story', { executableFile: './commands/start/index', isDefault: true })
    .alias('s');

  // parse at the end
  program.parse(process.argv);
})();
