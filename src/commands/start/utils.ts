import Table from 'cli-table';
import { filter } from 'fuzzy';

import { checkoutNewBranch } from '../../utils/git';
import {
  getStoryTypeLabel,
  getStoryTypeIcon,
  getStoryBranchName,
  isUnstartedStory,
  moveStoryToStartedState,
} from '../../utils/pivotal/common';
import {
  PivotalStory,
  StoryState,
  PivotalStoryResponse,
  LabelResponse,
  PivotalProfile,
} from '../../utils/pivotal/types';
import { StartStoryWorkflow, StartStoryAction } from './types';
import {
  PickStoryWorkflowQuestions,
  WorkOnNewStoryAnswers,
  WorkOnNewStoryQuestions,
  getSelectStoryFromListQuestions,
  getStartStoryQuestions,
} from './questions';
import inquirer from '../../utils/inquirer';
import PivotalClient from '../../utils/pivotal/client';
import { truncate, slugifyName } from '../../utils/string';

/**
 * Parse the labels string into a list of labels
 * @param {string} labels
 * @example formatLabels('dx, 2.0, test, ') => ['dx', '2.0, 'test']
 * @example formatLabels('') => []
 */
const parseLabels = (labelNames: string) => {
  if (!labelNames) return [];

  return labelNames
    .split(',')
    .map(val => val.trim())
    .filter(Boolean);
};

export const formatLabels = (labels: LabelResponse[]) =>
  labels
    .map(label => label.name)
    .join(', ')
    .trim();

export const addAttribution = (description?: string) => `${description || ''}

--
(story created via [pivotal-flow](https://github.com/ClearTax/pivotal-flow))
`;

export const getNewStoryPayload = ({
  ownerId,
  answers,
}: {
  ownerId: number;
  answers: WorkOnNewStoryAnswers;
}): PivotalStory => {
  const { story_type, name, estimate, labelNames, description = '' } = answers;
  return {
    story_type,
    name,
    estimate,
    labels: parseLabels(labelNames || ''),
    description: addAttribution(description),
    owner_ids: [ownerId],
    // assuming the story is in the current iteration if you are working on it
    current_state: StoryState.Planned,
  };
};

export const getStoryDetailsAsTable = (story: PivotalStoryResponse): string => {
  const table = new Table({
    colWidths: [15, 55],
    head: ['', 'Story Details'],
    colors: true,
    style: {
      head: ['green', 'bold'],
    },
  });
  const { name, story_type, labels, estimate, url, description = null } = story;
  const rows = [
    { Title: name },
    { Type: getStoryTypeLabel(story_type) },
    { Labels: formatLabels(labels) },
    typeof estimate === 'number' && { Estimate: estimate },
    { URL: url },
    description && description.length && { Description: description },
  ].filter(Boolean);

  table.push(...rows);

  return table.toString();
};

export const createNewStory = async (client: PivotalClient, ownerId: number) => {
  // const { id: ownerId } = await client.getProfile();
  const answers = await inquirer.prompt(WorkOnNewStoryQuestions);
  const storyPayload = getNewStoryPayload({ ownerId, answers });
  return client.createStory(storyPayload);
};

/**
 * Gets the search query for Pivotal Advanced Search to fetch stories based on the parameters.
 * @param assignedSelf Whether to search for stories assigned to the current user
 * @param ownerId Current users id
 */
export const getSearchStoryQuery = (assignedSelf: boolean, ownerId: number) => {
  if (assignedSelf) {
    return `mywork:"${ownerId}" AND state:unstarted,planned`;
  }
  // mywork query was much faster than owner:"" or no:owner and other options
  // refer https://www.pivotaltracker.com/help/articles/advanced_search/
  return `mywork:"" AND -owner:"${ownerId}" AND state:unstarted,planned`;
};

export const getExistingStories = async (client: PivotalClient, owned: boolean, ownerId: number) => {
  const query = getSearchStoryQuery(owned, ownerId);
  const {
    stories: { stories },
  } = await client.getStories(query);

  if (!(stories && stories.length)) {
    throw new Error(
      'No stories found. Please ensure that you have stories in your current iteration/backlog and try again.'
    );
  }
  return stories;
};

export const getWorkflow = async ({ newStory }: { newStory: boolean }) => {
  if (newStory === true) {
    return StartStoryWorkflow.New;
  }
  const { selection } = await inquirer.prompt(PickStoryWorkflowQuestions);
  return selection;
};

export const getStoryToWorkOn = async (client: PivotalClient, owner: PivotalProfile, workflow: StartStoryWorkflow) => {
  const { id: ownerId } = owner;

  if (workflow === StartStoryWorkflow.New) {
    const story = await createNewStory(client, ownerId);
    return story;
  }

  const owned = workflow === StartStoryWorkflow.Owned;
  const stories = await getExistingStories(client, owned, ownerId);
  const { story } = await inquirer.prompt(getSelectStoryFromListQuestions(stories));
  return story;
};

/**
 * Returns an autocomplete-source for searching through stories.
 * @see https://github.com/mokkabonna/inquirer-autocomplete-prompt#example
 */
export const getSearchableStoryListSource = (
  /** Current story list to search from */
  stories: PivotalStoryResponse[]
) => {
  const choices = stories.map(story => {
    const { story_type, name, id } = story;
    return {
      name: `[${id}] ${getStoryTypeIcon(story_type)}: ${truncate(name)}`,
      value: story,
    };
  });

  const source = async (_: null, input = '') => {
    const results = filter(input, choices, {
      extract: choice => choice.name,
    });
    return results.map(result => result.original);
  };

  return source;
};

export const startWorkingOnStory = async (client: PivotalClient, story: PivotalStoryResponse) => {
  const { actions, branchName: branchNameInput } = await inquirer.prompt(getStartStoryQuestions(story));
  const { story_type, id } = story;

  if (actions.includes(StartStoryAction.MoveToStartedState) && isUnstartedStory(story.current_state)) {
    // move to started state
    await moveStoryToStartedState(client, story);
  }

  if (actions.includes(StartStoryAction.CheckoutNewBranch)) {
    const slugifiedBranchName = slugifyName(branchNameInput);
    const branchName = getStoryBranchName(slugifiedBranchName, story_type, id);
    checkoutNewBranch(branchName);
  }

  return;
};
