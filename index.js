#!/usr/bin/env node
const axios = require('axios');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { execSync } = require('child_process');
const utils = require('./utils');
const constants = require('./constants');

const {
  isSetupDone,
  PIVOTAL_TOKEN,
  PIVOTAL_PROJECT_ID,
  getBranchPrefix,
  getCheckoutQuestions,
  formatLabels,
  getStoryQuestions,
} = utils;

const { SETUP_QUESTIONS, STORY_QUESTIONS, CONFIRM_QUESTIONS, WORKFLOW_QUESTIONS, STORY_KIND } = constants;

/**
 * Set up the pivotal token and project id
 */
const setupProject = () => {
  inquirer.prompt(SETUP_QUESTIONS).then(answers => {
    const { pivotalToken, pivotalProjectId } = answers;
    if (pivotalToken && pivotalProjectId) {
      console.log(
        chalk.yellow(`
To setup run the following commands in your console.
You can also add them to your profile (~/.bash_profile, ~/.zshrc, ~/.profile, or ~/.bashrc) so it's set up for all new terminal sessions.

  ${chalk.white(`export PIVOTAL_TOKEN=${pivotalToken}`)}
  ${chalk.white(`export PIVOTAL_PROJECT_ID=${pivotalProjectId}`)}

Once you run the above two commands, you can run the start script again:
  ${chalk.white('pivotal-flow-start')}
`)
      );
    } else {
      console.log(chalk.red(`Project set up failed. Please try again.`));
    }
  });
};
/**
 * Prompt the user to setup the project
 */
const confirmSetup = () => {
  inquirer.prompt(CONFIRM_QUESTIONS).then(answers => {
    const { projectSetup } = answers;
    if (projectSetup) {
      setupProject();
    } else {
      console.log(
        chalk.red(
          `Set-up aborted. You would have to create Pivotal stories manually and manually add their IDs to your branch.`
        )
      );
    }
  });
};

// axios basic config
const request = axios.create({
  baseURL: `https://www.pivotaltracker.com/services/v5`,
  timeout: 30000, // search could be really slow in pivotal
  headers: { 'X-TrackerToken': PIVOTAL_TOKEN },
});

/**
 * Get the details about the current user
 */
const getProfileDetails = async () => {
  return await request.get('/me').then(res => res.data);
};

/**
 * Create a story for the given project
 * @param  {String} projectId
 * @param  {Object} data
 */
const postStory = async (projectId, data) => {
  return await request.post(`/projects/${projectId}/stories`, data).then(res => res.data);
};

/**
 * Create pivotal story
 */
const createStory = async () => {
  /* eslint-disable @typescript-eslint/camelcase */
  try {
    const storyAnswers = await inquirer.prompt(STORY_QUESTIONS);

    // need the current user id to set the story owner
    // otherwise the story will be unassigned
    const user = await getProfileDetails();

    const { story_type, name, estimate, labelValues } = storyAnswers;
    const labels = formatLabels(labelValues);
    const storyData = {
      story_type,
      name,
      estimate,
      labels,
      owner_ids: [user.id],
      current_state: 'planned', // assuming the story is started if you are working on it
    };

    const story = await postStory(PIVOTAL_PROJECT_ID, storyData);
    console.log(chalk.green(`\n\n✓ Story created successfully (${chalk.underline(story.url)})\n\n`));

    // checkout to a new branch
    const checkoutAnswers = await inquirer.prompt(getCheckoutQuestions(story));
    const { confirmCheckout, branchName } = checkoutAnswers;
    if (confirmCheckout && branchName) {
      const checkoutBranchName = `${getBranchPrefix(story_type)}/${branchName}_${story.id}`;
      execSync(`git checkout -b ${checkoutBranchName}`);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const getStories = async ({ projectId = PIVOTAL_PROJECT_ID, query }) => {
  const url = `/projects/${projectId}/search?query=${query}`;
  return await request.get(url).then(res => res.data);
};

const workOnStory = async (owner = '') => {
  const query = `mywork:"${owner}" AND state:unstarted,planned`;
  const projectId = PIVOTAL_PROJECT_ID;
  const data = await getStories({ projectId, query });
  const {
    stories: { stories },
  } = data;
  const ans = await inquirer.prompt(getStoryQuestions(stories));
  console.log(ans);
};

// initialize the project
const init = async () => {
  // check if project set up is already done
  if (isSetupDone) {
    const ans = await inquirer.prompt(WORKFLOW_QUESTIONS);
    switch (ans.storyKind) {
      case STORY_KIND.NEW:
        createStory();
        break;
      case STORY_KIND.MY_STORY:
        const user = await getProfileDetails();
        workOnStory(user.id);
        break;
      case STORY_KIND.PICK_STORY:
        workOnStory();
        break;
      default:
        createStory();
        break;
    }
  } else {
    console.log(chalk.red(`PIVOTAL_TOKEN and/or PIVOTAL_PROJECT_ID missing from your environment.\n`));
    confirmSetup();
  }
};

init();
