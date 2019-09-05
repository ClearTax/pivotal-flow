#!/usr/bin/env node
const axios = require('axios');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { execSync } = require('child_process');
const utils = require('./utils');
const constants = require('./constants');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

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
  timeout: 10000, // search could be really slow in pivotal
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
 * Check out to a new branch based on the story details and branch name
 * @param {object} story
 * @param {string} story.story_type - feature | bug | chore
 * @param {string} story.id - Unique id of the story
 */
const checkoutBranch = async story => {
  const { story_type, id } = story;
  const checkoutAnswers = await inquirer.prompt(getCheckoutQuestions(story));
  const { confirmCheckout, branchName } = checkoutAnswers;
  if (confirmCheckout && branchName) {
    const checkoutBranchName = `${getBranchPrefix(story_type)}/${branchName}_${id}`;
    execSync(`git checkout -b ${checkoutBranchName}`);
  }
};

/**
 * Create pivotal story
 */
const createStory = async ({ ownerId }) => {
  try {
    const storyAnswers = await inquirer.prompt(STORY_QUESTIONS);

    const { story_type, name, estimate, labelValues } = storyAnswers;
    const labels = formatLabels(labelValues);
    const storyData = {
      story_type,
      name,
      estimate,
      labels,
      owner_ids: [ownerId],
      current_state: 'planned', // assuming the story is in the current iteration if you are working on it
    };

    const story = await postStory(PIVOTAL_PROJECT_ID, storyData);
    console.log(chalk.green(`\n\n✓ Story created successfully (${chalk.underline(story.url)})\n\n`));

    // checkout to a new branch
    checkoutBranch(story);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

/**
 * Fetch stories based on project and pivotal query
 * @param  {string} projectId - Current project. default to PIVOTAL_PROJECT_ID
 * @param  {string} query - Pivotal search query
 * @return {Array} - Array of stories
 */
const getStories = async ({ projectId = PIVOTAL_PROJECT_ID, query }) => {
  const url = `/projects/${projectId}/search?query=${query}`;
  return await request.get(url).then(res => res.data);
};

/**
 * Work on an existing story.
 * @param  {string} storyKind - UNASSIGNED or MY_STORY
 * @param  {string} ownerId - User id
 */
const workOnStory = async ({ storyKind, ownerId }) => {
  // mywork query was much faster than owner:"" or no:owner and other options
  // refer https://www.pivotaltracker.com/help/articles/advanced_search/

  let query = `mywork:"${ownerId}" AND state:unstarted,planned`;
  if (storyKind === STORY_KIND.UNASSIGNED) {
    query = `mywork:"" AND -owner:"${ownerId}" AND state:unstarted,planned`;
  }
  const data = await getStories({ query });
  const {
    stories: { stories },
  } = data;
  if (stories && stories.length) {
    const answers = await inquirer.prompt(getStoryQuestions(stories));
    const [storyId] = answers.selectStory.match(/\d{9}/);
    const selectedStory = stories.find(story => story.id === Number(storyId));
    const { name, estimate = 'NA', labels = [], description = '' } = selectedStory;
    const printStory = {
      name,
      estimate,
      labels: labels.map(label => label.name || ''),
      description,
    };
    console.log(printStory);
    checkoutBranch(selectedStory);
  } else {
    console.log(chalk.red('No stories found. Please ensure that you have stories in your current iteration/backlog.'));
  }
};

// initialize the project
const init = async () => {
  // check if project set up is already done
  if (isSetupDone) {
    const ans = await inquirer.prompt(WORKFLOW_QUESTIONS);
    const user = await getProfileDetails();
    const ownerId = user.id;
    switch (ans.storyKind) {
      case STORY_KIND.NEW: {
        createStory({ ownerId });
        break;
      }
      case STORY_KIND.MY_STORY: {
        workOnStory({ storyKind: STORY_KIND.MY_STORY, ownerId });
        break;
      }
      case STORY_KIND.UNASSIGNED: {
        workOnStory({ storyKind: STORY_KIND.UNASSIGNED, ownerId });
        break;
      }
      default: {
        createStory({ ownerId });
        break;
      }
    }
  } else {
    console.log(chalk.red(`PIVOTAL_TOKEN and/or PIVOTAL_PROJECT_ID missing from your environment.\n`));
    confirmSetup();
  }
};

init();
