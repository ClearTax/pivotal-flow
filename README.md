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

`pivotal-flow` works best with [`husky` 🐶][husky] & [`git-tracker`][git-tracker].

## Usage

`pivotal-flow` has two commands to automate your workflow:

1. `pivotal-flow-start`:  
  Create new stories via the command line.
2. `pivotal-flow-check`:  
  Check all newly created branches have the pivotal story ID in the branch name.

> you can also use the `pfs` alias for `pivotal-flow-start`

### Starting a story

Run `pivotal-flow-start` (alias: `pfs`) as a local/global command to start creating stories from the command line:

![Pivotal Flow](https://assets1.cleartax-cdn.com/cleargst-frontend/misc/1567511137_pivotal_flow.gif)

### Adding a post-checkout hook

You can add the `pivotal-flow-check` as a post-checkout hook via [`husky` 🐶][husky].
Just add it to your `package.json` file, for example:

```diff
   },
   "husky": {
     "hooks": {
        // ...
+      "post-checkout": "pivotal-flow-check"
     }
   }
 }
```

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
