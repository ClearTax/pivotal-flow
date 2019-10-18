import chalk from 'chalk';

export const log = console.log;
export const error = (message: string) => console.error(chalk.bold.red(message));
export const warning = (message: string) => console.warn(chalk.keyword('orange')(message));

export const questionHelp = (message: string) => chalk.dim(message);
