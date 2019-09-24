# pivotal-flow 🔀

Automate your pivotal workflow.

[![npm](https://img.shields.io/npm/v/pivotal-flow?style=flat-square)](https://www.npmjs.com/package/pivotal-flow)
[![GitHub](https://img.shields.io/github/license/cleartax/pivotal-flow?style=flat-square)](https://github.com/ClearTax/pivotal-flow/blob/master/LICENSE.md)
[![npm](https://img.shields.io/npm/dw/pivotal-flow?style=flat-square)](https://www.npmjs.com/package/pivotal-flow)

## Install

```sh
# Install it locally for your npm project
npm install -D pivotal-flow

# You can also install it globally
npm install -g pivotal-flow
```

`pivotal-flow` works best with [`husky` 🐶][husky].

## Usage

`pivotal-flow` has few commands to automate your workflow:

### `pivotal-flow`

Create a new story or work on an existing story via the command line.
> you can also use the `pf` alias for `pivotal-flow`

### `pivotal-flow-check`

Check all newly created branches have the pivotal story ID in the branch name.

### `pivotal-flow:prepare-commit-msg`

Pick up story ID from a branch name & append it to each commit message.

## Set up

Add the hooks from pivotal-flow to your repo via [`husky` 🐶][husky].
Just add it to your `package.json` file, for example:

```diff
   },
   "husky": {
     "hooks": {
+      "post-checkout": "pivotal-flow-check",
+      "prepare-commit-msg": "pivotal-flow-prepare-commit-msg",
+      "commit-msg": "pivotal-flow-commit-msg"
     }
   }
 }
```

## Starting a new story

Run `pivotal-flow` (alias: `pf`) as a local/global command to start creating stories from the command line:

![Pivotal Flow](https://assets1.cleartax-cdn.com/cleargst-frontend/misc/1567511137_pivotal_flow.gif)

## Work on an existing story

![my stories](https://assets1.cleartax-cdn.com/cleargst-frontend/misc/1567672934_mystories.gif)

### Fuzzy search

![fuzzy search](https://assets1.cleartax-cdn.com/cleargst-frontend/misc/1567672849_fuzzy_search.gif)

Now, while checking out a new branch, you can ensure that the [Pivotal][pivotal] story id is added to your branch name.

Using this alongside [`git-tracker`][git-tracker] and the [`Pivotal GitHub Integration`][pivotal-github] ensures your updates (commits, pushes, merges etc) on GitHub are posted directly and automatically to your Pivotal stories.

### Other

Follow instructions for [`git-tracker`][git-tracker] and the [`Pivotal GitHub Integration`][pivotal-github] to set-up the entire flow for your repository.

## References

1. [PivotalTracker][pivotal]
1. [`git-tracker`][git-tracker]
1. [Git Hooks][git-hooks]
1. [Husky 🐶][husky]

[pivotal]: https://www.pivotaltracker.com/features
[husky]: https://github.com/typicode/husky
[git-tracker]: https://github.com/stevenharman/git_tracker
[git-hooks]: https://git-scm.com/docs/githooks#_post_checkout
[pivotal-github]: https://www.pivotaltracker.com/help/articles/github_integration/
