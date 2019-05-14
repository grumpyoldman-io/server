# Home Automation Server

## Table of Contents

- [Getting started](#getting-started-with-your-new-project)
- [Scripts](#scripts)
- [Code Hygiene](#code-hygiene)
  - [Validation](#validation)
  - [TSLint](#tslint)
  - [Prettier](#prettier)
- [Automation](#Automation)
  - [Husky](#husky)

## Getting started with your new project

1. Enter the correct .ENV vars
2. `yarn install`
3. `yarn start`

## Scripts

- `yarn start`: This will start the node project.
- `yarn lint`: Test the project files with TSLint
- `yarn format`: Format the project files with Prettier
- `yarn validate`: Check the project files for any typescript errors

## Code Hygiene

To keep the code hygiene of everyone involved with a project in line, we've added testing, linting and formatting libraries to this to the project. These are made required by precommit hook.

### Validation

Typescript has it's own validation which you can use to find any Typescript faults you may have made.

Commands:
`yarn validate`

### TSLint

We use [TSLint](https://palantir.github.io/tslint/) checks your typescript for linting errors.
In our Typescript projects we enfore some coding rules. These should help with keeping the projects in a similar code style so any developer can work with the project.
The rules can be changed in `tslint.json`

Commands:
`yarn lint`

### Prettier

[Prettier](https://prettier.io/) formats your code so it looks pretty and is readable.

Commands:
`yarn format`

## Automation

### Husky

We use [Husky](https://github.com/typicode/husky#readme) for automating test during the commit and push processes.
