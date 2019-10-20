#!/usr/bin/env node
import { Command } from 'commander';

import { abortIfNotSetup } from '../init/utils';
import PivotalClient from '../../utils/pivotal/client';
import { getWorkflow, getStoryToWorkOn, startWorkingOnStory } from './utils';

(async () => {
  const program = new Command();
  program.name('start');
  program.option('-n, --new-story', 'create a new story & start working on it', false);

  // parse at the end & then use options
  program.parse(process.argv);

  await abortIfNotSetup();
  try {
    // await startWorkingOnStory({
    //   story_type: 'feature',
    //   name: 'this be the story name',
    //   id: 12345678,
    // } as PivotalStoryResponse);
    // process.exit(0);

    const { newStory = false } = program;
    const workflow = await getWorkflow({ newStory: newStory as boolean });

    const client = new PivotalClient();
    const profile = await client.getProfile();
    const story = await getStoryToWorkOn(client, profile, workflow);
    await startWorkingOnStory(story);
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
