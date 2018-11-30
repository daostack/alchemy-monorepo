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

[TODO: this is WIP, and should be made better. See the `docker` branch]

Tests require some setup, which can be fragile, and sometimes needs to be re-run:

```sh
npm run test-setup
```
Now, with the docker-containers running, you can run the tests:
```sh
npm run
```

run a specific test:
```sh
npm run test -- dao.test
```
Or watch:
```sh
npm run test -- --watch
```
