#!/usr/bin/env node
import { Command } from 'commander';
import serializeJavascript from 'serialize-javascript';
import chalk from 'chalk';

import { abortIfNotSetup } from '../init/utils';
import PivotalClient from '../../utils/pivotal/client';
import { getWorkflow, getStoryToWorkOn, displayStoryDetails } from './utils';
import { log } from '../../utils/console';

(async () => {
  const program = new Command();
  program.name('start');
  program.option('-n, --new-story', 'create a new story & start working on it', false);

  // parse at the end & then use options
  program.parse(process.argv);

  await abortIfNotSetup();
  try {
    const { newStory = false } = program;
    const client = new PivotalClient();
    const profile = await client.getProfile();
    const workflow = await getWorkflow({ newStory: newStory as boolean });

    const story = await getStoryToWorkOn(client, profile, workflow);

    log(chalk`{ bold.underline You've selected the following story: }\n`);
    displayStoryDetails(story);
    // console.log(serializeJavascript(story, { space: 2 }));

    // process.exit(0);
  } catch (e) {
    process.exit(1);
  }
})();
