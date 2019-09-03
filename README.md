# pivotal-flow

Automate your pivotal workflow

[![NPM](https://badgen.net//npm/v/pivotal-flow)](https://www.npmjs.com/package/pivotal-flow)

## Install

`npm install -D pivotal-flow`

can be installed globally as well

`npm install -g pivotal-flow`

### Usage

pivotal-flow contains two commands to automate your workflow

1. `pivotal-flow-start`
2. `pivotal-flow-check`

> you can also use the `pfs` alias for `pivotal-flow-start`

### See it in action

![Pivotal Flow](https://assets1.cleartax-cdn.com/cleargst-frontend/misc/1567431893_pivotal-flow.gif)

`pivotal-flow-check` can be used to check if the newly created branch contains the story id. This works
best as a `post-checkout` git hook.

![pivotal check](https://assets1.cleartax-cdn.com/cleargst-frontend/misc/1567432167_pivotal-check.png)

### References

1. [Git tracker](https://github.com/stevenharman/git_tracker)
2. [Git hooks](https://git-scm.com/docs/githooks#_post_checkout)
3. [Husky](https://github.com/typicode/husky)
