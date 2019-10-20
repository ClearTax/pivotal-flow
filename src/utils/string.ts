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
