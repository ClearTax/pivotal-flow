#!/usr/bin/env node

const { inspect } = require('util');
const { HUSKY_GIT_PARAMS } = process.env;

/** use this to test what params you receive when executing a hook & then add them to test cases */
console.log(inspect(HUSKY_GIT_PARAMS, true, 3, true));
