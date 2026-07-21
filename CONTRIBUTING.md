# Contributing

## General Guideline

### Reporting Issues

If you have found what you think is a bug, please [open an issue](https://github.com/trendingcandles/react-candlesticks/issues).

When reporting an issue, include a minimal reproduction or a link to a live example if you think it would be helpful.

For any usage questions, please [start a discussion](https://github.com/trendingcandles/react-candlesticks/discussions/new?category=q-a).

If your question is about installation, component usage, or API options, please check the [documentation](https://docs.reactcandlesticks.com/docs/) first.

### Discussion Templates

When opening a discussion, please choose the matching template:

- **Feature Request** for proposing a new capability.
- **Contribution Proposal** for proposing work you plan to implement in a pull request.
- **General Feedback** for broader product, API, docs, or UX feedback.

For any large feature, substantial refactor, or other significant piece of work, start a discussion and align scope before implementation begins.

### Suggesting New Features

If you are here to suggest a feature, please start a **Feature Request** discussion first. This helps clarify the use case and discuss how it could be implemented before work begins.

### Committing

[The conventional commit spec](https://www.conventionalcommits.org/en/v1.0.0/) is used in this repository. In short, that means a commit has to be one of the following types:

Your commit type must be one of the following:

- **feat**: A new feature.
- **fix**: A bug fix.
- **refactor**: A code change that neither fixes a bug nor adds a feature.
- **chore**: Changes to the build process, configuration, dependencies, CI/CD pipelines, or other auxiliary tools and libraries.
- **docs**: Documentation-only changes.
- **test**: Adding missing or correcting existing tests.

If you are unfamiliar with the usage of conventional commits,
the short version is to simply specify the type as a first word,
and follow it with a colon and a space, then start your message
from a lowercase letter, like this:

```
feat: add a 'foo' type support
```

You can also specify the scope of the commit in the parentheses after a type:

```
fix(react): change the 'bar' parameter type
```

### Development

If you would like to contribute by fixing an open issue or developing a new feature you can use this suggested workflow:

#### General

1. Fork this repository.
2. Create a new feature branch based off the `main` branch.
3. Install dependencies with `npm ci`.
4. Install the project git hooks with `npm run hooks:install`.
5. Make your changes and run `npm run check` before opening a pull request.
6. Git stage your required changes and commit (review the commit guidelines below).
7. Submit the PR for review.

### Pull Requests

Please try to keep your pull request focused in scope and avoid including unrelated commits.

If you are planning a large feature or substantial refactor, start a discussion before beginning implementation so scope and approach can be aligned first.

After you have submitted your pull request, feedback or requested changes may follow, so please check ✅ ["Allow edits from maintainers"](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) on your PR.

Thank you for contributing! :heart:
