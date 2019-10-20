import memoize from 'fast-memoize';

import { PIVOTAL_ID_IN_STRING } from '../../regex';
import { StoryType, StoryState, PivotalStoryResponse } from './types';
import { slugifyName } from '../string';
import PivotalClient from './client';
import { inDetachedHeadState, getCurrentBranch } from '../git';

const UNSTARTED_STORY_STATES = [StoryState.Planned, StoryState.Rejected, StoryState.Unscheduled, StoryState.Unstarted];

export const getStoryTypeIcon = (type: StoryType) => {
  switch (type) {
    case StoryType.Feature:
      return `⭐️ `;
    case StoryType.Bug:
      return `🐞 `;
    case StoryType.Chore:
      return `⚙️  `;
    case StoryType.Release:
      return `🏁 `;
    default:
      return '';
  }
};

export const getStoryTypeLabel = (type: StoryType) => `${getStoryTypeIcon(type)} ${type}`;

export const getStoryTypeChoices = () =>
  Object.values(StoryType).map(type => ({
    value: type,
    name: getStoryTypeLabel(type),
  }));

/**
 * Get the branch prefix based on story type.
 * @example
 *  getBranchPrefix('bug') => 'bugfix'
 *  getBranchPrefix('feature') => 'feature'
 *  getBranchPrefix('chore') => 'chore'
 *  getBranchPrefix('release') => 'release'
 */
const getBranchPrefix = (
  /** Type of story eg 'feature' / 'bug' etc. */
  type: StoryType
) => {
  return type === 'bug' ? 'bugfix' : type;
};

/**
 * Get branch name in the format `<story_type>/<slugified_story_name>_<story_id>`
 */
export const getStoryBranchName = memoize((
  /** Story name or branch name as input by the user  */
  name: string,
  /** Type of the story */
  type: StoryType,
  /** Story ID */
  id: number
) => {
  const prefix = getBranchPrefix(type);
  const slugifiedName = slugifyName(name);
  return `${prefix}/${slugifiedName}_${id}`;
});

/**
 * Check if the story has not been marked as started.
 */
export const isUnstartedStory = (currentState: PivotalStoryResponse['current_state']) =>
  currentState && UNSTARTED_STORY_STATES.includes(currentState);

/**
 * Move an existing story to the 'started' state.
 */
export const moveStoryToStartedState = async (client: PivotalClient, story: PivotalStoryResponse) => {
  return client.updateStory(story.id, {
    current_state: StoryState.Started,
  });
};

export interface GetStoryIdResults {
  found: boolean;
  id: string;
  formatted: string;
}

/**
 * Get the Pivotal story id details from any input string.
 */
export const getStoryId = (
  /** any string input to search for story id In */
  input: string
): GetStoryIdResults => {
  const matches = input.match(PIVOTAL_ID_IN_STRING) || [''];
  const [matched] = matches;

  const storyId = matched.startsWith('#') ? matched.substring(1) : matched;
  const formatted = `#${storyId}`;
  const found = Boolean(storyId);

  return { found, id: storyId, formatted };
};

/**
 * Get the Pivotal story id (if it exists) details from the current branch name.
 */
export const getStoryIfFromCurrentBranch = (): GetStoryIdResults => {
  if (inDetachedHeadState()) {
    return { found: false, id: '', formatted: '' };
  }

  const branch = getCurrentBranch() || '';
  return getStoryId(branch);
};
