import { StoryType } from './types';

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
