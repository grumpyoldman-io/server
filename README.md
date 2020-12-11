# Home Automation Server

A typescript + dependency injected nodejs app for running a home automation server.

## Table of Contents

- [Getting started](#getting-started-with-your-new-project)
- [Scripts](#scripts)
- [Code Hygiene](#code-hygiene)
  - [Validation](#validation)
  - [ESLint](#eslint)
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

To keep the code hygiene of everyone involved with a project in line, I've added linting and formatting libraries to this to the project. These are enforced by a precommit hook.

### Validation

Typescript has it's own validation which you can use to find any Typescript faults you may have made.

Commands:
`yarn validate`

### ESLint

I use [ESLint](https://eslint.org/) to check typescript for linting errors.
The rules can be changed in `.eslintrc.js`

Commands:
`yarn lint`

### Prettier

[Prettier](https://prettier.io/) formats your code so it looks pretty and is readable.

Commands:
`yarn format`

## Automation

### Husky

I use [Husky](https://github.com/typicode/husky#readme) for automating commands during the commit and push processes.
