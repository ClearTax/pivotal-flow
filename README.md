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

`pivotal-flow` is built to work with [`husky` 🐶][husky] along with the [Pivotal GitHub integration][pivotal-github].

## Set up

Add the hooks and commands from pivotal-flow to your repo to your [`husky` 🐶][husky] config in your `package.json` file, for example:

```diff
   },
   "scripts": {
     // ...
+     "start:story": "pivotal-flow start"
   },
   "husky": {
     "hooks": {
+      "post-checkout": "pivotal-flow hook post-checkout",
+      "prepare-commit-msg": "pivotal-flow hook prepare-commit-msg",
+      "commit-msg": "pivotal-flow hook commit-msg",
     }
   }
 }
```

Run `pivotal-flow init` to receive instructions on how to set-up pivotal flow to start using its [commands](#commands).

## Usage

`pivotal-flow` has few commands to automate your workflow.

Run `pivotal-flow --help` to see usage & command documentation.

> you can also use the `pf` alias for `pivotal-flow`.

## Commands

### init

```sh
# provides instructions on how to get started with using the pivotal-flow commands
$ pivotal-flow init
```

### start

Create a new story or work on an existing story via the command line.

```sh
 # start working on a story guided by a questionnaire
 $ pivotal-flow start

 # create a new story & then start working on it
 $ pivotal-flow start --new
```

## Hooks

### `post-checkout`

Check that all _newly created branches_ have a [Pivotal][pivotal] Story ID in the branch name.

**Why do we need the ID in the branch?**
This allows the GitHub integration to send updates to pivotal to [show branch & PR information in a story](https://www.pivotaltracker.com/help/articles/github_integration/#using-the-github-integration-branches).

<img src="https://www.pivotaltracker.com/help/kb_assets/github_integration_4@2x.png" width="300" />

<img src="https://www.pivotaltracker.com/help/kb_assets/github_integration_8@2x.png" width="300" />

### `prepare-commit-msg`

Picks up story ID from a branch name & appends it to each commit message.

Again, this allows the GitHub integration to send updates to pivotal of [commit information in a story](https://www.pivotaltracker.com/help/articles/github_integration/#using-the-github-integration-commits).

<img src="https://www.pivotaltracker.com/help/kb_assets/github_integration_11@2x.png" width="300" />

### `commit-msg`

Checks if _each_ new commit message contains the Story ID as well.

In case you're not using the automatic addition hook (`prepare-commit-msg`) or don't want to enforce story id being present in branch name, this hook makes sure the Story ID is present in the commit message (added by other means by the user).

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
