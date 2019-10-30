#!/usr/bin/env node
import { Command } from 'commander';

import { error, warning } from '../../utils/console';
import { abortIfNotSetup } from '../init/utils';
import PivotalClient from '../../utils/pivotal/client';
import { getWorkflow, getStoryToWorkOn, startWorkingOnStory } from './utils';

(async () => {
  const program = new Command();
  program.name('start');
  program.option('-n, --new-story', 'create a new story & start working on it', false);
  program.option('--debug', 'Debug the start command', false);

  // parse at the end & then use options
  program.parse(process.argv);
  if (program.debug) console.log(program.opts());

  await abortIfNotSetup();
  const { newStory = false, debug = false } = program;
  try {
    const workflow = await getWorkflow({ newStory: newStory as boolean });

    const client = new PivotalClient({ debug });
    const profile = await client.getProfile();
    const story = await getStoryToWorkOn(client, profile, workflow);
    await startWorkingOnStory(story);
  } catch (e) {
    if (e instanceof Error) {
      error(e.valueOf().toString());
    } else {
      warning('An unknown error occurred. Use the --debug option to get more details.`');
    }
    debug && error(e);
    process.exit(1);
  }
  process.exit(0);
})();
