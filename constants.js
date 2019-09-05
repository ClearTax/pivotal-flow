const chalk = require('chalk');

const CONFIRM_QUESTIONS = [
  {
    type: 'confirm',
    name: 'projectSetup',
    prefix: chalk.cyan.dim('Looks like pivotal-flow has not been set-up.\n'),
    message: 'Would you like to set up pivotal-flow now?',
    default: false,
  },
];

const SETUP_QUESTIONS = [
  {
    type: 'input',
    name: 'pivotalToken',
    prefix: chalk.cyan.dim(`
‣ What's an API Token?:
  ${chalk.underline('https://www.pivotaltracker.com/help/articles/api_token/')}
‣ Create an API Token here:
  ${chalk.underline('https://www.pivotaltracker.com/profile')}\n`),
    message: 'Pivotal API Token',
    validate: val => {
      if (val && val.length === 32) return true;
      return 'Please enter a valid 32 character pivotal token.';
    },
  },
  {
    type: 'input',
    name: 'pivotalProjectId',
    prefix: chalk.cyan.dim(`
You can find the Project ID in the last part of your project board's URL:
For eg. in ${chalk.underline('https://www.pivotaltracker.com/n/projects/12341234')} ${chalk.bold(
      '12341234'
    )} is the Project ID.
`),
    message: 'Pivotal Project ID:',
    validate: value => {
      if (value.match(/^[0-9]{7}/)) return true;
      return 'Please enter a valid 7 digit Project ID.';
    },
  },
];

const STORY_QUESTIONS = [
  {
    type: 'list',
    name: 'story_type',
    message: 'Story: Type',
    choices: ['feature', 'bug', 'chore'],
    default: 0, // 0 --> index of the choices array
    prefix: chalk.cyan.dim(`
A story type is one of 'feature | bug | chore'.

‣ How to choose a story type:
  ${chalk.underline('https://www.pivotaltracker.com/help/articles/adding_stories/#story-types')} \n`),
  },
  {
    type: 'input',
    name: 'name',
    message: 'Story: Title',
    validate: val => {
      // story name should not be too short
      if (val && val.length > 8) return true;
      return 'Please enter a valid story name (min. 9 characters)';
    },
    prefix: chalk.cyan.dim(`
A story title is a brief description of the purpose or the desired outcome of the story.

‣ What is a story:
  ${chalk.underline('https://www.pivotaltracker.com/help/articles/terminology/#story')} \n`),
  },
  {
    type: 'list',
    name: 'estimate',
    message: 'Story: Points',
    choices: [0, 1, 2, 3, 5, 8],
    default: 0, // 0 --> index of the choices array
    when: answers => {
      return answers.story_type === 'feature';
    },
    prefix: chalk.cyan.dim(`
Points are a rough estimate on the effort/complexity of the story.

‣ What is an estimate / what are story points?:
  ${chalk.underline('https://www.pivotaltracker.com/help/articles/estimating_stories/')} \n`),
  },
  {
    type: 'input',
    name: 'labelValues',
    message: 'Story: Labels/Epics',
    default: '',
    prefix: chalk.cyan.dim(`
Use labels to tag groups of related stories:
Enter comma-separated values, for eg: '${chalk.bold('front-end, performance, epic-feature')}'

‣ What are labels:
  ${chalk.underline('https://www.pivotaltracker.com/help/articles/tagging_stories_with_labels')}
‣ Epics:
  ${chalk.underline('https://www.pivotaltracker.com/help/articles/tracking_big_features_themes_with_epics/')} \n`),
  },
];

const STORY_KIND = {
  NEW: 'Start a new Story',
  MY_STORY: 'Work on a story assigned to you',
  UNASSIGNED: `Work on other story`,
};

const WORKFLOW_QUESTIONS = [
  {
    type: 'list',
    name: 'storyKind',
    message: 'Pick a flow',
    choices: [STORY_KIND.NEW, STORY_KIND.MY_STORY, STORY_KIND.UNASSIGNED],
  },
];

module.exports = {
  SETUP_QUESTIONS,
  STORY_QUESTIONS,
  CONFIRM_QUESTIONS,
  WORKFLOW_QUESTIONS,
  STORY_KIND,
};
