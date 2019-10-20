// commonjs compatible import for slugify
// @see https://github.com/sindresorhus/slugify/blob/e95f1f748fe83e2fe6dadc0de70f48fd3815aac4/index.d.ts#L26
import slugify = require('@sindresorhus/slugify');

/**
 * Truncate a long string and add ellipsis towards the end.
 * @example truncate('foobar',3) => 'foo...'
 */
export const truncate = (
  /** The input string */
  input: string,
  /** Max characters after which the string is truncated (default is `100`) */
  upto = 100
) => {
  if (input.length <= upto) return input;
  const truncated = input.substring(0, upto);
  return `${truncated.substring(0, truncated.lastIndexOf(' '))}...`;
};

/**
 * Get a truncated slugified string.
 */
export const slugifyName = (
  /** An input string with any number of characters */
  input: string,
  /** Max length to truncate after */
  upto = 25
) => {
  let slugifiedName = slugify(input);
  const droppablePortion = slugifiedName.indexOf('-', upto);

  if (droppablePortion >= upto) {
    slugifiedName = slugifiedName.substr(0, droppablePortion);
  }

  return slugifiedName;
};
