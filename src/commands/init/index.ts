#!/usr/bin/env node
import { Command } from 'commander';
import { performSetup } from './utils';

(async () => {
  const program = new Command();
  program.name('init');
  program.parse(process.argv);

  await performSetup();
})();
