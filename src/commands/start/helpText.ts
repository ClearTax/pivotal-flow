import chalk from 'chalk';

import { questionHelp } from '../../utils/console';
import { StoryType } from '../../utils/pivotal/types';

export const HelpWorkOnNewStory = {
  story_type: questionHelp(`
A story type is one of ${chalk.bold(Object.values(StoryType).join(' | '))}.

‣ How to choose a story type:
  ${chalk.underline('https://www.pivotaltracker.com/help/articles/adding_stories/#story-types')}
\n`),
  name: questionHelp(`
A story title is a brief description of the purpose or the desired outcome of the story.

‣ What is a story:
  ${chalk.underline('https://www.pivotaltracker.com/help/articles/terminology/#story')}
\n`),
  estimate: questionHelp(`
Points are a rough estimate on the effort/complexity of the story.

‣ What is an estimate / what are story points?:
  ${chalk.underline('https://www.pivotaltracker.com/help/articles/estimating_stories/')}
\n`),
  labelNames: questionHelp(`
Use labels to tag groups of related stories:
Enter comma-separated values, for eg: '${chalk.white('front-end, performance, epic-feature')}'

‣ What are labels:
  ${chalk.underline('https://www.pivotaltracker.com/help/articles/tagging_stories_with_labels')}
‣ Epics:
  ${chalk.underline('https://www.pivotaltracker.com/help/articles/tracking_big_features_themes_with_epics/')}
\n`),
  promptDescription: questionHelp(`
You can add a short description of functionality or an incremental piece of capability that is of value to the customer or delivery team.
Press Enter to skip.
`),
};

export const HelpSelectStoryFromList = questionHelp(`You can also search by story name or story id \n`);
