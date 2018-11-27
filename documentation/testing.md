# Overview

Tests expect running ethereum and graphql nodes.
You can start the docker containers by running
```sh
npm run subgraph
```
(It may take a while to build the docker containers)

```sh
npm run test
```

run a specific test:
```sh
npm run test -- dao.test
```
