# DAOstack Client

The DAOStack Client  
* A library to work with the DAOstack ecosystem
* Convenience functions to interact with the DAOstack contracts: vote, stake and execute proposals
* A frontend client library for the [DAOstack subgraph](https://github.com/daostack/subgraph) - search for daos, proposaals
*

[![Build Status](https://travis-ci.com/daostack/client.svg?token=aXt9zApRNkfx8zDMypWx&branch=master)](https://travis-ci.com/daostack/client)

## Usage

In your nodejs project run

```
npm install --save @daostack/client
```
now you can do:
```
import Arc from '@daostack/client'

// create an Arc instance
const arc = new Arc({
  contractAddresses: await getContractAddresses(graphqlHttpMetaProvider, 'daostack'),
  graphqlHttpProvider,
  graphqlWsProvider,
  ipfsProvider,
  web3Provider
})
// get a list of DAOs
arc.daos()

```

* [overview](./documentation/overview.md)
* [development](./documentation/development.md)
* [example](./documentation/example-session.md)
* [troubleshooting](./documentation/troubleshooting.md)

## Developing

Get all services running:

```sh
docker-compose up graph-node
```

This command will start all the services that are needed for a test environment: a graph-node instance, ganache, IPFS and postgresql.


To run the tests, run:
```sh
npm run test
```

After you are done, run:
```
docker-compose down
```


### Commands


 - `npm run build`: Generate bundles and typings, create docs
 - `npm run lint`: Lints code
 - `npm run test`: run all tests
