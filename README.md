# DAOstack Client

A frontend client library for the [DAOstack subgraph](https://github.com/daostack/subgraph)

[![Build Status](https://travis-ci.com/daostack/client.svg?token=aXt9zApRNkfx8zDMypWx&branch=master)](https://travis-ci.com/daostack/client)

(Project started using [TypeScript Library Starter](https://github.com/alexjoverm/typescript-library-starter))

## Usage

1. `npm install --save @daostack/client`
2. `import Arc from '@daostack/client'`

##
[overview](./documentation/overview.md)
[development](./documentation/development.md)
[example](./documentation/example-session.md)
[example](./documentation/example-session.md)
[troubleshooting](./documentation/troubleshooting.md)

## Developing

Get all services running:

```sh
docker-compose up graph-node
```

This command will build and start a graph instance, ganache, IPFS and postgresql.

Before being able to use these services, you need to deploy the DAOStack contracts and configure the graph node to listen to changes:
```sh
npm run setup-env
```

To run the tests, run:
```sh
npm run test
```

After you are done, run:
```
docker-compose down -v
```

If you update the subgraph dependency in `package.json`, you must rebuild the containers and re-configure the graph node:
```
docker-compose build
npm run setup-env
```

### Commands


 - `npm run build`: Generate bundles and typings, create docs
 - `npm run lint`: Lints code
