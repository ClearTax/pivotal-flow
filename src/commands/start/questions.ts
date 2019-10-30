import { QuestionCollection } from 'inquirer';

import { slugifyName } from '../../utils/string';
import { getStoryTypeChoices, getStoryBranchName } from '../../utils/pivotal/common';
import { StartStoryWorkflow } from './types';
import { StoryType, PointScales, PivotalStoryResponse } from '../../utils/pivotal/types';
import { HelpWorkOnNewStory, HelpSelectStoryFromList, HelpStartStory } from './helpText';
import { getSearchableStoryListSource, getStoryDetailsAsTable } from './utils';

export interface PickStoryWorkflowAnswers {
  selection: StartStoryWorkflow;
}

export const PickStoryWorkflowQuestions: QuestionCollection<PickStoryWorkflowAnswers> = [
  {
    type: 'list',
    name: 'selection',
    message: 'What do you want to do?',
    default: 0,
    choices: [
      { name: 'Create a new story & start working on it', value: StartStoryWorkflow.New },
      { name: 'Work on a story assigned to you', value: StartStoryWorkflow.Owned },
      { name: 'Work on any other story', value: StartStoryWorkflow.Unassigned },
    ],
  },
];

export interface WorkOnNewStoryAnswers {
  story_type: StoryType;
  name: string;
  labelNames: string;
  promptDescription: boolean;
  estimate?: number;
  description?: string;
}

export const WorkOnNewStoryQuestions: QuestionCollection<WorkOnNewStoryAnswers> = [
  {
    type: 'list',
    name: 'story_type',
    message: 'Story Type:',
    choices: getStoryTypeChoices(),
    default: 0, // 0 --> index in the choices[]
    prefix: HelpWorkOnNewStory.story_type,
  },
  {
    type: 'input',
    name: 'name',
    message: 'Story Title:',
    prefix: HelpWorkOnNewStory.name,
    validate: (name: string): true | string => {
      if (name && name.length >= 9) {
        return true;
      }
      return 'Please enter a valid story title (min. 9 characters).';
    },
  },
  {
    // TODO: fetch estimation options based on project settings later
    type: 'list',
    name: 'estimate',
    message: 'Story Estimate (points):',
    choices: PointScales.fibonacci,
    default: 1, // 1 --> index in the choices[]
    when: answers => answers.story_type === StoryType.Feature,
    prefix: HelpWorkOnNewStory.estimate,
  },
  {
    type: 'input',
    name: 'labelNames',
    message: 'Story Labels/Epics:',
    default: '',
    prefix: HelpWorkOnNewStory.labelNames,
  },
  {
    type: 'confirm',
    name: 'promptDescription',
    message: 'Would you like to add a description to the story?',
    default: false,
    prefix: HelpWorkOnNewStory.promptDescription,
  },
  {
    type: 'editor',
    name: 'description',
    message: 'Story Description',
    when: answers => answers.promptDescription === true,
    default: '',
  },
];

export interface SelectStoryFromListAnswers {
  story: PivotalStoryResponse;
}

export const getSelectStoryFromListQuestions = (
  stories: PivotalStoryResponse[]
): QuestionCollection<SelectStoryFromListAnswers> => [
  {
    type: 'autocomplete',
    name: 'story',
    prefix: HelpSelectStoryFromList,
    message: 'Pick a story to work on',
    source: getSearchableStoryListSource(stories),
  },
];

export interface StartStoryAnswers {
  checkoutBranch: boolean;
  branchName: string;
}

export const getStartStoryQuestions = (story: PivotalStoryResponse): QuestionCollection<StartStoryAnswers> => {
  const { story_type: type, id, name } = story;
  const slugifiedStoryName = slugifyName(name);
  const suggestedBranchName = getStoryBranchName(slugifiedStoryName, type, id);
  const storyTable = getStoryDetailsAsTable(story);
  return [
    {
      type: 'confirm',
      name: 'checkoutBranch',
      message: `\n\nWould you like to checkout a new branch for this story?:`,
      prefix: HelpStartStory.actions(storyTable),
      default: true,
    },
    {
      type: 'input',
      name: 'branchName',
      message: 'Branch Name:',
      prefix: HelpStartStory.branchName(suggestedBranchName),
      when: answers => answers.checkoutBranch === true,
      default: slugifiedStoryName,
      validate: (input: string) => {
        if (!input || input.length < 8 || input.length > 25) {
          return 'Please limit the branch name (excluding story-type & story-id) to between 8-25 characters.';
        }
        return true;
      },
    },
  ];
};
