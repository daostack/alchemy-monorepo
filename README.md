# DAOstack Ganache

A ganache with all DAOstack contracts and an example DAO already migrated.
This repo is exposed both as an npm package, a CLI and a docker container.

# Versioning

Both the npm package and the docker image are versioned identically according to the `@daostack/arc` package.
Example: `@daostack/arc@X.Y.Z` -> npm: `@daostack/ganache@X.Y.Z` and dockerhub: `daostack/ganache:X.Y.Z`

# Use the docker image

1. `docker pull daostack/ganache`
2. `docker run daostack/ganache ...` - use arguments as specified in [`ganache-cli`](https://github.com/trufflesuite/ganache-cli#using-ganache-cli)

# Use as a library

1. `npm install @daostack/ganache`
2. `const Ganache = require('@daostack/ganache') // instead of: require('ganache-cli')` - use as a drop-in replacement for the `ganache-cli` library.
