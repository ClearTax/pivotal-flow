import chalk from 'chalk';
import { QuestionCollection } from 'inquirer';
import { questionHelp } from '../../utils/console';

export interface SetupAnswers {
  pivotalToken: string;
  pivotalProjectId: string;
}

export const SetupQuestions: QuestionCollection<SetupAnswers> = [
  {
    type: 'input',
    name: 'pivotalToken',
    prefix: questionHelp(`
‣ What's an API Token?:
  ${chalk.underline('https://www.pivotaltracker.com/help/articles/api_token/')}
‣ Create an API Token here:
  ${chalk.underline('https://www.pivotaltracker.com/profile')}
\n`),
    message: 'Pivotal API Token:',
    validate: (val: string) => {
      if (val && val.length === 32) return true;
      return 'Please enter a valid 32 character pivotal token.';
    },
    default: process.env.PIVOTAL_TOKEN,
  },
  {
    type: 'input',
    name: 'pivotalProjectId',
    prefix: questionHelp(`
You can find the Project ID in the last part of your project board's URL:
For eg. in ${chalk.underline(
      'https://www.pivotaltracker.com/n/projects/12341234'
    )} - '12341234' would be the Project ID.
\n`),
    message: 'Pivotal Project ID:',
    validate: (value: string) => {
      if (value.match(/^[0-9]{7}/)) return true;
      return 'Please enter a valid 7 digit Project ID.';
    },
    default: process.env.PIVOTAL_PROJECT_ID,
  },
];

export interface PromptSetupAnswers {
  wantSetup: boolean;
}

export const PromptToSetup: QuestionCollection<PromptSetupAnswers> = [
  {
    type: 'confirm',
    name: 'wantSetup',
    prefix: questionHelp('Looks like pivotal-flow has not been set-up.\n'),
    message: 'Would you like to set up pivotal-flow now?',
    default: false,
  },
];
