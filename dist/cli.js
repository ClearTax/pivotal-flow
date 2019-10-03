#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const meow_1 = __importDefault(require("meow"));
const pivotal_flow_1 = __importDefault(require("./pivotal-flow"));
const CLI_CONFIG = {};
const cli = meow_1.default(`
Usage: pivotal-flow [--version] [--help] <command> [<args>]

Available commands in pivotal-flow:

  Check which version of pivotal-flow is installed:
  $ pivotal-flow --version

  Start working on an existing/new Pivotal story:
  $ pivotal-flow
  $ pivotal-flow start

Hooks:

  Check for Pivotal Story ID in the current branch name:
  $ pivotal-flow check-branch

  Add Pivotal Story ID from current branch name to every commit as
  a prepare-commit-msg hook via husky:
  $ pivotal-flow prepare-commit-msg

  Check for Pivotal Story ID presence in every commit message via the
  commit-msg hook via husky:
  $ pivotal-flow prepare-commit-msg
`, CLI_CONFIG);
pivotal_flow_1.default(cli);
