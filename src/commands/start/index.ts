#!/usr/bin/env node
import { Command } from 'commander';
import { abortIfNotSetup } from '../init/util';
import inquirer from '../../utils/inquirer';
import { WorkOnNewStoryQuestions } from './questions';

(async () => {
  const program = new Command();
  program.name('start');

  program.option('--debug', 'Debug options', false);
  program.option('-n, --new-story', 'create a new story & start working on it', false);
  program.parse(process.argv);

  if (program.debug) console.log(program.opts());

  await abortIfNotSetup();

  if (program.newStory) {
    const answers = await inquirer.prompt(WorkOnNewStoryQuestions);
    console.log(answers);
  }
})();
