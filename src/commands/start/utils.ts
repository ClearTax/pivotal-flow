import Table from 'cli-table';
import { filter } from 'fuzzy';

import { checkoutNewBranch } from '../../utils/git';
import { getStoryTypeLabel, getStoryTypeIcon, getStoryBranchName } from '../../utils/pivotal/common';
import {
  PivotalStory,
  StoryState,
  PivotalStoryResponse,
  LabelResponse,
  PivotalProfile,
} from '../../utils/pivotal/types';
import { StartStoryWorkflow } from './types';
import {
  PickStoryWorkflowQuestions,
  getPickProjectQuestions,
  WorkOnNewStoryAnswers,
  WorkOnNewStoryQuestions,
  getSelectStoryFromListQuestions,
  getStartStoryQuestions,
} from './questions';
import inquirer from '../../utils/inquirer';
import PivotalClient from '../../utils/pivotal/client';
import { truncate, slugifyName } from '../../utils/string';
import { getPivotalFlowConfig } from '../init/utils';

/**
 * Parse the labels string into a list of labels
 * @param {string} labels
 * @example formatLabels('dx, 2.0, test, ') => ['dx', '2.0, 'test']
 * @example formatLabels('') => []
 */
const parseLabels = (labelNames: string): string[] => {
  if (!labelNames) return [];

  return labelNames
    .split(',')
    .map(val => val.trim())
    .filter(Boolean);
};

/**
 * Get display-able labels as a string.
 * @example formatLabels([{ name: 'one', ...}, { name: 'two', ... }]) => 'one, two'
 */
export const formatLabels = (labels: LabelResponse[]): string =>
  labels
    .map(label => label.name)
    .join(', ')
    .trim();

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
    description,
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

export const createNewStory = async (client: PivotalClient, ownerId: number): Promise<PivotalStoryResponse> => {
  const answers = await inquirer.prompt(WorkOnNewStoryQuestions);
  const storyPayload = getNewStoryPayload({ ownerId, answers });
  return client.createStory(storyPayload);
};

/**
 * Gets the search query for Pivotal Advanced Search to fetch stories based on the parameters.
 * @param assignedSelf Whether to search for stories assigned to the current user
 * @param ownerId Current users id
 */
export const getSearchStoryQuery = (assignedSelf: boolean, ownerId: number): string => {
  if (assignedSelf) {
    return `mywork:"${ownerId}" AND state:unstarted,planned`;
  }
  // mywork query is much faster than owner:"" or no:owner and other options
  // refer https://www.pivotaltracker.com/help/articles/advanced_search/
  return `mywork:"" AND -owner:"${ownerId}" AND state:unstarted,planned`;
};

export const getExistingStories = async (
  client: PivotalClient,
  owned: boolean,
  ownerId: number
): Promise<PivotalStoryResponse[]> => {
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

export const getWorkflow = async ({ newStory }: { newStory: boolean }): Promise<StartStoryWorkflow> => {
  if (newStory === true) {
    return StartStoryWorkflow.New;
  }
  const { selection } = await inquirer.prompt(PickStoryWorkflowQuestions);
  return selection;
};

export const selectProjectToCreateStory = async (): Promise<{ apiToken: string; projectId: string }> => {
  const config = await getPivotalFlowConfig();

  if (config && config.projects && config.projects.length) {
    const { projects, pivotalApiToken } = config;
    // if there's a single project, let's just select it
    if (projects.length === 1) {
      const [project] = projects;
      return { projectId: String(project.id), apiToken: pivotalApiToken };
    }

    const { selectedProject } = await inquirer.prompt(getPickProjectQuestions(projects));
    return { projectId: String(selectedProject), apiToken: pivotalApiToken };
  }

  return { projectId: '', apiToken: '' };
};

export const getStoryToWorkOn = async (
  client: PivotalClient,
  owner: PivotalProfile,
  workflow: StartStoryWorkflow
): Promise<PivotalStoryResponse> => {
  const { id: ownerId } = owner;

  if (workflow === StartStoryWorkflow.New) {
    return await createNewStory(client, ownerId);
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

export const startWorkingOnStory = async (story: PivotalStoryResponse): Promise<void> => {
  const { checkoutBranch, branchName: branchNameInput } = await inquirer.prompt(getStartStoryQuestions(story));
  const { story_type, id } = story;

  if (checkoutBranch) {
    const slugifiedBranchName = slugifyName(branchNameInput);
    const branchName = getStoryBranchName(slugifiedBranchName, story_type, id);
    checkoutNewBranch(branchName);
  }

  return;
};
