# pivotal-flow 🔀

> A command-line tool that helps you manage & automate your workflow to use with [PivotalTracker][pivotal].

[![npm](https://img.shields.io/npm/v/pivotal-flow?style=flat-square)](https://www.npmjs.com/package/pivotal-flow)
[![GitHub](https://img.shields.io/github/license/cleartax/pivotal-flow?style=flat-square)](https://github.com/ClearTax/pivotal-flow/blob/master/LICENSE.md)
[![npm](https://img.shields.io/npm/dw/pivotal-flow?style=flat-square)](https://www.npmjs.com/package/pivotal-flow)

## Install

```sh
# install pivotal-flow globally
# you can check if it was installed correctly by running `pivotal-flow --version`
npm install -g pivotal-flow

# initialize pivotal-flow
pivotal-flow init
```

`pivotal-flow` is built to work with [`husky` 🐶][husky] along with the [Pivotal GitHub integration][pivotal-github].

## Commands

Run `pivotal-flow --help` to see usage & documentation.

> you can also use the `pf` alias for `pivotal-flow`.

### init

A guided questionnaire to set-up `pivotal-flow` with the basic [configuration](#configuration):

```sh
$ pivotal-flow init
# generate a basic configuration file in your home directory.
```

### start

Create a new story or work on an existing story (from the [stories](https://www.pivotaltracker.com/help/articles/working_with_stories/) in your [PivotalTracker project(s)](https://www.pivotaltracker.com/help/articles/creating_a_project/)):

```sh
$ pivotal-flow start
# start working on a story guided by a questionnaire
```

## git-hooks via husky

`pivotal-flow` also provides a few [git-hooks] to automate a few tasks when working with `PivotalTracker` as your project management tool. You can add the provided hooks using [husky].

In order to use the hooks from `pivotal-flow`, add it as a dependency to your npm project:

```sh
$ npm install --save-dev pivotal-flow
# install it as a dev-dependency
```

Then add the hooks and/or commands to your `package.json`:

```diff
   },
   "scripts": {
     // ...
+     "start:story": "pivotal-flow start"
   },
   "husky": {
     "hooks": {
+      "post-checkout": "pivotal-flow hook check-story-id-in-branch",
+      "prepare-commit-msg": "pivotal-flow hook add-story-id-to-commit",
+      "commit-msg": "pivotal-flow hook check-story-id-in-commit",
     }
   }
 }
```

### Hooks

#### `check-story-id-in-branch`

`post-checkout` - check that all _newly created branches_ have a [PivotalTracker][pivotal] story `id` in the branch name.

**Why do we need the ID in the branch?**
<br />

This allows the GitHub integration to send updates to pivotal to [show branch & PR information in a story](https://www.pivotaltracker.com/help/articles/github_integration/#using-the-github-integration-branches).

<img src="https://www.pivotaltracker.com/help/kb_assets/github_integration_4@2x.png" width="300" />

<img src="https://www.pivotaltracker.com/help/kb_assets/github_integration_8@2x.png" width="300" />

#### `add-story-id-to-commit`

`add-story-id-to-commit` added as a `prepare-commit-msg` hook will pick up story `id` from the branch name (if it is present) and append it to each commit message.

Again, this allows the GitHub integration to send updates to `PivotalTracker` of [commit information in a story](https://www.pivotaltracker.com/help/articles/github_integration/#using-the-github-integration-commits).

<img src="https://www.pivotaltracker.com/help/kb_assets/github_integration_11@2x.png" width="300" />

#### `check-story-id-in-commit`

`check-story-id-in-commit` as a `commit-msg` hook - checks if _each_ new commit message contains the story `id` as well.

In case you're not using the `add-story-id-to-commit` hook or don't want to enforce story id being present in every branch name, this hook makes sure the story id is present in the commit message (added by other means by the user).

## Configuration

Once the `init` command is run, it creates a config file in your home directory. This is meant to be a per-user configuration.

You can modify/add the configuration file in multiple levels which are supported via [cosmiconfig].

Currently, a configuration file looks like the following:

```json
{
  "projects": [
    {
      "name": "Alpha",
      "id": 1234567
    },
    {
      "name": "Bravo",
      "id": 7654321
    }
  ],
  "pivotalApiToken": "abcde*****************************"
}
```

**NOTE**: Since the `pivotalApiToken` is meant to be private, we discourage adding the `pivotal-flow` configuration file to source control.

### Configuration Options

|Option|Type|Description|
|---|---|---|
|`pivotalApiToken`|`string`|[API Token from PivotalTracker](https://www.pivotaltracker.com/help/articles/api_token/).|
|`projects`|`project[]`|An array of `PivotalTracker` projects which will be part of your workflow for creating / working on stories.|
|`projects[i].name`|`string`|The name of the project (or an alias) to be used when picking among projects in the different commands.|
|`projects[i].id`| `string` / `number` |Each `PivotalTracker` project has an `id` which you can find by referring to your project's URL. For example, if your project's URL is `https://www.pivotaltracker.com/n/projects/1234567` then the project `id` would be `1234567`. This is required to query the stories from the project|

## Commands in action

### Starting a new story

Run `pivotal-flow` (alias: `pf`) as a local/global command to start creating stories from the command line:

![Pivotal Flow](https://assets1.cleartax-cdn.com/cleargst-frontend/misc/1567511137_pivotal_flow.gif)

### Work on an existing story

![my stories](https://assets1.cleartax-cdn.com/cleargst-frontend/misc/1567672934_mystories.gif)

### Fuzzy search

![fuzzy search](https://assets1.cleartax-cdn.com/cleargst-frontend/misc/1567672849_fuzzy_search.gif)

## Other

Using `pivotal-flow` hooks alongside [`Pivotal GitHub Integration`][pivotal-github] ensures your updates (commits, pushes, merges etc) on GitHub are posted directly and automatically to your Pivotal stories.

Follow instructions for and the [`Pivotal GitHub Integration`][pivotal-github] to set-up the entire flow for your repository.

## Credits

The concept of adding story ids (picked from the branch-name) to all commits are from the awesome [`git-tracker`][git-tracker] project by [@stevenharman](https://github.com/stevenharman) - ported to husky/node implementation in `pivotal-flow`'s `add-story-id-to-commit` hook.

## References

1. [PivotalTracker][pivotal]
1. [Git Hooks][git-hooks]
1. [Husky 🐶][husky]
1. [`git-tracker`][git-tracker]

[pivotal]: https://www.pivotaltracker.com/features
[husky]: https://github.com/typicode/husky
[git-tracker]: https://github.com/stevenharman/git_tracker
[git-hooks]: https://git-scm.com/docs/githooks#_post_checkout
[pivotal-github]: https://www.pivotaltracker.com/help/articles/github_integration/
[cosmiconfig]: https://github.com/davidtheclark/cosmiconfig
