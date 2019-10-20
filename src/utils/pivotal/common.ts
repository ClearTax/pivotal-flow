import memoize from 'fast-memoize';

import { StoryType, StoryState, PivotalStoryResponse } from './types';
import { slugifyName } from '../string';
import PivotalClient from './client';

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
