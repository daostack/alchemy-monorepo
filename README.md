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
  graphqlHttpProvider: "https://subgraph.daostack.io/subgraphs/name/v23",
  graphqlWsProvider: "wss://ws.subgraph.daostack.io/subgraphs/name/v23",
  web3Provider: `wss://mainnet.infura.io/ws/v3/e0cdf3bfda9b468fa908aa6ab03d5ba2`,
  ipfsProvider: {
    "host": "subgraph.daostack.io",
    "port": "443",
    "protocol": "https",
    "api-path": "/ipfs/api/v0/"
  }
})
// get a list of DAOs
arc.daos()
// before we can use the Arc instance to send transactions, we need to provide it
// with information on where the contracts can be found
// query the subgraph for the contract addresses, and use those
const contractInfos = await arc.fetchContractInfos()
arc.setContractInfo(contractInfos)

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
