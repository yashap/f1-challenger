# F1 Challenger

A monorepo for the F1 Challenger app.

## Dependencies

Install the following:

- [nvm](https://github.com/nvm-sh/nvm)
  - For managing multiple node versions
  - Suggest setting up `nvm` to [auto-switch to the right node version on cd](https://github.com/nvm-sh/nvm#deeper-shell-integration)
- [yarn](https://yarnpkg.com/)
  - A package manager/command line tool, similar to `npm`
  - Fist, ensure you're using the right `node` version
    - From `f1-challenger` run `nvm use`
  - Then run `corepack enable`
    - `corepack` includes `yarn`, and ships with Node.js >=16.10, but you have to opt in to enabling it
    - If you run `which yarn`, it should show something like `~/.nvm/versions/node/<node_version>/bin/yarn`
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - For your local platform, e.g. [Docker for Mac](https://docs.docker.com/desktop/install/mac-install/) for a Mac
- [cmake](https://cmake.org/)
  - On a Mac, `brew install cmake`

After this, you can try running `yarn build-migrate && yarn format && yarn lint && yarn test` to ensure everything works, before proceeding to `Dev Workflows` (below).

## Dev Workflows

All `yarn` commands can be run at the root of the repo, where they will use the root `package.json` scripts. For the most part, this will invoke some sort of `turbo run` command, to run them in all workspaces (all backends, frontends and packages). Alternately, you can also run `yarn` commands from the various app/package subdirectories, which will in turn use their `package.json` scripts, but running via the root directory (and thus `turbo`) is generally better, as it takes advantage of `turborepo` caching.

For any of the above commands, you can run against a specific workspace (a library in `packages/`, a backend in `backends/` or a frontend in `frontends/`) via putting `workspace <workspace>` after `yarn` and before the command, e.g.:

```bash
yarn workspace @f1-challenger/context-propagation test
```

The name of the workspace is the value of the `name` field in its `package.json`.

### Core Dev Workflow

All commands below should be run from the root of this repo.

```bash
# When starting work for the day, or after running git pull
# Installs dependencies, spins up and migrates local DBs, builds everything, etc.
yarn build-migrate

# Serve all backends (in watch mode)
yarn serve:backend

# Serve the frontend (in watch mode)
yarn serve:frontend

# Load email UI to see account verification emails, password reset emails, etc.
yarn email

# Before you push to GitHub (no CI setup yet, so do this manually!)
yarn format && yarn test
```

### Migrations

See the `README.md` for each backend service for instructions about migrations.

### Email

We don't send emails locally - instead, they get sent to [MailSlurper](https://www.mailslurper.com/), a small SMTP mail server, that saves emails to an in-memory DB, and lets you view them in a UI. If you want to check on emails (e.g. account verification emails, password reset emails, etc.), as long as your local backend is running (`yarn serve:backend`), you can run `yarn email` from the root of this repo to view them.

### Install Dependencies

**Install an external dependency (e.g. an npm package)**

```bash
# Add a package to a workspace
yarn workspace <workspace> add <package>
# e.g. yarn workspace @f1-challenger/challenger-service add lodash

# Add a dev package to a workspace
yarn workspace <workspace> add -D <package>

# Remove a package from a workspace
yarn workspace <workspace> remove <package>
```

**Install an internal dependency (e.g. depend on something in `packages/`)**

```bash
# Add a dependency like this to your package.json
"<package>": "*"

# e.g. to make the @f1-challenger/challenger-service app depend on @f1-challenger/context-propagation
{
  "name": "@f1-challenger/challenger-service",
  ...
  "dependencies": {
    "@f1-challenger/context-propagation": "*",
    ...
  }
}

# And then run
yarn install
```

### Clear all build artifacts (`node_modules`, `dist`, etc.) and local databases

```bash
yarn clean

# Or for a real "hard" version
yarn clean && rm yarn.lock
```

### Adding a new app/package

- For adding a new package (a.k.a. library), copy `packages/context-propagation` as an example
- For adding a new backend service, copy `backends/challenger-service` as an example
- For adding a new React web frontend, copy `frontends/challenger-web` as an example

If adding new packages becomes a pain point, we could consider writing [Turborepo custom code generators](https://turbo.build/repo/docs/core-concepts/monorepos/code-generation).

### Dev fixtures

For local development, it's useful to have some default users, parking spots, etc. setup, a.k.a. "local dev fixtures." We do this by taking and restoring DB snapshots.

As an example, say you want to add a new parking spot to the default dev fixtures, you'd spin up your local env, add that parking spot in the UI, then run `yarn db:dump-fixtures`.

Later, when people run `yarn db:restore-fixtures`, they'll get the restore the DB state you snapshotted to their local DB, e.g. they'll get that new parking spot you added.
