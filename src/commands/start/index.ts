#!/usr/bin/env node
import { Command } from 'commander';

import { abortIfNotSetup } from '../init/utils';
import PivotalClient from '../../utils/pivotal/client';
import { getWorkflow, getStoryToWorkOn, displayStoryDetails } from './utils';

(async () => {
  const program = new Command();
  program.name('start');
  program.option('-n, --new-story', 'create a new story & start working on it', false);

  // parse at the end & then use options
  program.parse(process.argv);

  await abortIfNotSetup();
  try {
    const { newStory = false } = program;
    const workflow = await getWorkflow({ newStory: newStory as boolean });

    const client = new PivotalClient();
    const profile = await client.getProfile();
    const story = await getStoryToWorkOn(client, profile, workflow);
    displayStoryDetails(story);
    process.exit(0);
  } catch (e) {
    process.exit(1);
  }
})();
