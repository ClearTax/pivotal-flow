/* eslint-disable @typescript-eslint/no-var-requires */
import inquirer from 'inquirer';

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

export default inquirer;
