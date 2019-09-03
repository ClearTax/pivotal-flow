const chalk = require('chalk');
const slugify = require('@sindresorhus/slugify');

const { PIVOTAL_TOKEN, PIVOTAL_PROJECT_ID } = process.env;
const isSetupDone = !!(PIVOTAL_TOKEN && PIVOTAL_PROJECT_ID);

/**
 * Format the labels string
 * @param {string} value
 * @example formatLabels('dx, 2.0, test, ') => ['dx', '2.0, 'test']
 * @example formatLabels('') => []
 */
const formatLabels = value => {
  if (!value) return [];
  return value
    .split(',')
    .map(val => val.trim())
    .filter(Boolean);
};

/**
 * Add prefix to the story type
 * @param {String} storyType
 * @example getBranchPrefix('feature') => feature
 * @example getBranchPrefix('bug') => bugfix
 * @example getBranchPrefix('chore') => chore
 */
const getBranchPrefix = storyType => {
  return storyType === 'bug' ? 'bugfix' : storyType;
};

/**
 * Get a branch-name suggestion from the story name
 * @param {string} story.name - name of the story
 * @param {string} story.id - pivotal id of the story
 */
const suggestBranchName = (story) => {
  const { name = '' } = story;
  let slugifiedName = slugify(name);
  const droppablePortion = slugifiedName.indexOf('-', 25);

  if (droppablePortion >= 25) {
    slugifiedName = slugifiedName.substr(0, droppablePortion);
  }

  return slugifiedName;
};

const getCheckoutQuestions = ({ name, story_type, id }) => {
  const suggestedBranchName = suggestBranchName({ name });
  const prefix = getBranchPrefix(story_type);
  return (
    [
      {
        type: 'confirm',
        name: 'confirmCheckout',
        message: 'Would you like to checkout a new git branch for this story?',
        default: false,
      },
      {
        type: 'input',
        name: 'branchName',
        default: suggestedBranchName,
        message: 'Branch Name',
        prefix: chalk.cyan.dim(`
${chalk.bold(`'${prefix}/'`)} will be prefixed with the branch name.

Eg. if you enter '${chalk.bold('allow-user-login')}', the final branch name would be
${chalk.bold(`${prefix}/${'allow-user-login'}_${id}`)}\n`),
        validate: val => {
          // branch name should not be too short
          if (val && val.length <= 3) {
            return 'Please enter a valid branch name (min. 4 characters)';
          }
          if (val && /[^a-zA-Z\d\-_]/i.test(val)) {
            return 'Please avoid any special characters in the branch name.';
          }
          return true;
        },
        when: answers => {
          return answers.confirmCheckout;
        },
      },
    ]
  );
};

const CONFIRM_QUESTIONS = [
  {
    type: 'confirm',
    name: 'projectSetup',
    message: 'Would you like to set up auto creation of pivotal stories?',
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
For eg. in ${chalk.underline('https://www.pivotaltracker.com/n/projects/12341234')} ${chalk.bold('12341234')} is the Project ID.
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
  ${chalk.underline('https://www.pivotaltracker.com/help/articles/adding_stories/#story-types')} \n`)
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
  ${chalk.underline('https://www.pivotaltracker.com/help/articles/terminology/#story')} \n`)
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
  ${chalk.underline('https://www.pivotaltracker.com/help/articles/estimating_stories/')} \n`)
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
  ${chalk.underline('https://www.pivotaltracker.com/help/articles/tracking_big_features_themes_with_epics/')} \n`)
  },
];

module.exports = {
  SETUP_QUESTIONS,
  STORY_QUESTIONS,
  CONFIRM_QUESTIONS,
  isSetupDone,
  PIVOTAL_TOKEN,
  PIVOTAL_PROJECT_ID,
  getBranchPrefix,
  getCheckoutQuestions,
  formatLabels,
  suggestBranchName,
};
