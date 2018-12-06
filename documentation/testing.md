# Overview

Tests expect running ethereum and graphql nodes running.

Build and start the docker containers by running
```sh
npm run docker:up
```
This script is running the containers within the node_modules/@doastack/subgraph repository
You can stop the containers using
```sh
npm run docker:down
```
Tests require some setup. The `test-setup`  command will (re-)deploy the DAOStack Smart Contracts and configure
the subgraph to use the deployed contracts.

```sh
npm run setup-env
```
Now, with the docker-containers running, you are ready to run the tests:
```sh
npm run test
```


run a specific test:
```sh
npm run test -- dao.test
```
Or watch:
```sh
npm run test -- --watch
```
