import { getStoryId, getStoryBranchName } from './common';
import { StoryType } from './types';

describe('getStoryId()', () => {
  it('fetches story id when present', () => {
    expect(getStoryId('feature/add-prepare-commit-msg-hook_168690318')).toEqual({
      formatted: '#168690318',
      found: true,
      id: '168690318',
    });

    expect(getStoryId('feature/add-prepare-commit-msg-hook-#168690318')).toEqual({
      formatted: '#168690318',
      found: true,
      id: '168690318',
    });
  });

  it('when not present', () => {
    expect(getStoryId('feature/add-prepare-commit-msg-hook')).toEqual({
      formatted: '#',
      found: false,
      id: '',
    });

    expect(getStoryId('xyz123')).toEqual({
      formatted: '#',
      found: false,
      id: '',
    });
  });
});

describe('getStoryBranchName()', () => {
  const storyId = 123456789;
  test.each<[string, string, StoryType, number]>([
    // <branchName, storyName, storyType, storyId>
    ['feature/add-a-new-button-to-zoids_123456789', 'Add a new button to zoids', StoryType.Feature, storyId],
    [
      'feature/build-an-end-to-end-feature_123456789',
      'Build an end-to-end feature with the new application architecture',
      StoryType.Feature,
      storyId,
    ],
    [
      'chore/new-itr-dashboard-no-backend_123456789',
      'New ITR Dashboard (no backend integration)',
      StoryType.Chore,
      storyId,
    ],
    ['bugfix/p0-itr-1-validation-errors_123456789', '[P0][ITR-1] Validation Errors', StoryType.Bug, storyId],
    [
      'chore/create-schema-and-resolvers_123456789',
      'Create schema and resolvers for summary table data in app',
      StoryType.Chore,
      storyId,
    ],
    [
      'bugfix/fix-null-pointer-exception_123456789',
      'Fix Null Pointer Exception when computing tables for customers who have not filed recently.',
      StoryType.Bug,
      storyId,
    ],
    [
      'bugfix/fix-type-error-cannot-read_5678901',
      `Fix TypeError: Cannot read property 'foo' of undefined`,
      StoryType.Bug,
      5678901,
    ],
    [
      'feature/add-https-example-com-in-some_123456789',
      'Add https://example.com in some page',
      StoryType.Feature,
      storyId,
    ],

    ['chore/add-xml-http-request-listener_123456789', 'Add XMLHttpRequest listener', StoryType.Chore, storyId],
    ['chore/add-listener-for-xml-http_123456789', 'Add listener for XMLHttpRequest', StoryType.Chore, storyId],
  ])('%s', (expected, name, type, id) => {
    expect(getStoryBranchName(name, type, id)).toBe(expected);
  });
});
