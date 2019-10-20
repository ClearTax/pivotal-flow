import { QuestionCollection } from 'inquirer';

import { getStoryTypeChoices } from '../../utils/pivotal/common';
import { StartStoryOption } from './types';
import { StoryType, PointScales, PivotalStoryResponse } from '../../utils/pivotal/types';
import { HelpWorkOnNewStory, HelpSelectStoryFromList } from './helpText';
import { getSearchableStoryListSource } from './utils';

export interface StartStoryAnswers {
  selected: StartStoryOption;
}

export const StartStoryQuestions: QuestionCollection<StartStoryAnswers> = [
  {
    type: 'list',
    name: 'selection',
    message: 'What do you want to do?',
    choices: [
      { name: 'Create a new story & start working on it', value: StartStoryOption.New },
      { name: 'Work on a story assigned to you', value: StartStoryOption.Owned },
      { name: 'Work on any other story', value: StartStoryOption.Unassigned },
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
    default: '\n<!-- add a description here -->',
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
