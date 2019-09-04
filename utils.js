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
const suggestBranchName = story => {
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
  return [
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
  ];
};

module.exports = {
  isSetupDone,
  PIVOTAL_TOKEN,
  PIVOTAL_PROJECT_ID,
  getBranchPrefix,
  getCheckoutQuestions,
  formatLabels,
  suggestBranchName,
};
