#!/usr/bin/env node
import { Command } from 'commander';

(async () => {
  const program = new Command();
  program.name('start');

  program.option('-n, --new', 'create a new story & start working on it');
  program.parse(process.argv);
})();
