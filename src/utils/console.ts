import chalk from 'chalk';
import { inspect } from 'util';

export const log = console.log;
export const error = (message: string) => console.error(chalk.bold.red(message));
export const warning = (message: string) => console.warn(chalk.keyword('orange')(message));
export const questionHelp = (message: string) => chalk.dim(message);

/**
 * Log iif `process.env.HUSKY_DEBUG === '1'`
 */
export const debugLog = (
  /* ... message  */
  ...args: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
) => {
  if (process.env.HUSKY_DEBUG === '1') {
    console.debug(...args);
  }
};

/**
 * Log an object for debugging with a label iff `process.env.HUSKY_DEBUG === '1'`
 */
export const debugLogObject = (
  /** Label for the log */
  label: string,
  /** The debug object to log */
  obj: object,
  /** Options passed to the util.inspect() function */
  options?: NodeJS.InspectOptions
) => {
  const { showHidden = true, depth = 1, colors = true } = options || {};
  debugLog(
    `${chalk.underline(label)}: ${inspect(obj, {
      showHidden,
      depth,
      colors,
    })}`
  );
};
