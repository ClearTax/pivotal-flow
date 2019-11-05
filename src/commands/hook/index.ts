import { Command } from 'commander';

// hooks
import recordParams from './record-params';
import commitMsg from './commit-msg';
import postCheckout from './post-checkout';
import prepareCommitMsg from './prepare-commit-msg';

// utils
import { parseHookParams } from '../../utils/hooks';
import { error, warning } from '../../utils/console';

const program = new Command();

interface Handler {
  (...args: string[]): void;
}

const HANDLERS = {
  'record-params': recordParams as Handler,
  'check-story-id-in-commit': commitMsg as Handler,
  'check-story-id-in-branch': postCheckout as Handler,
  'add-story-id-to-commit': prepareCommitMsg as Handler,
};

const AVAILABLE_HOOKS: string[] = Object.keys(HANDLERS);

const isValidHook = (hook: string): hook is keyof typeof HANDLERS => AVAILABLE_HOOKS.includes(hook);
const getAvailableHooks = () => `${AVAILABLE_HOOKS.map(hook => `  - ${hook}`).join('\n')}`;

program
  .name('hook')
  .usage(`<type>\n\n<type>:\n${getAvailableHooks()}`)
  .option(
    '-E <env_name>',
    'Override the name of the environment variable where the the git-hook parameters will be provided. Use this to make the command work with a hook provider other than husky.',
    'HUSKY_GIT_PARAMS'
  )
  .parse(process.argv);

const [hookType] = program.args;

if (!isValidHook(hookType)) {
  program.outputHelp();
  warning(`\nInvalid hook '${hookType}'.\n`);
  process.exit(1);
} else {
  try {
    const params = parseHookParams((program.E as string) || 'HUSKY_GIT_PARAMS');
    HANDLERS[hookType](...params);
  } catch (e) {
    error(`Error running hook '${hookType}'.`);
    if (e instanceof Error) {
      warning(`${e.name}: ${e.message} ${e.stack}`);
    }
    process.exit(1);
  }
}
