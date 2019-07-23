[![Build Status](https://travis-ci.com/daostack/client.svg?token=aXt9zApRNkfx8zDMypWx&branch=master)](https://travis-ci.com/daostack/client)

# DAOstack Client

The DAOStack Client is a nodejs library to work with the DAOstack ecosystem
* Convenience functions to interact with the [DAOstack contracts](https://github.com/daostack/arc): create proposals, and vote and stake on them
* A client library for the [DAOstack subgraph](https://github.com/daostack/subgraph) - search for daos, proposals


## Usage

In your nodejs project run

```
npm install --save @daostack/client
```
now you can do:
```
import { Arc } from '@daostack/client'

// create an Arc instance
const arc = new Arc({
  graphqlHttpProvider: "https://subgraph.daostack.io/subgraphs/name/v23",
  graphqlWsProvider: "wss://ws.subgraph.daostack.io/subgraphs/name/v23",
  web3Provider: `wss://mainnet.infura.io/ws/v3/${YOUR_TOKEN_HERE}`,
  ipfsProvider: {
    "host": "subgraph.daostack.io",
    "port": "443",
    "protocol": "https",
    "api-path": "/ipfs/api/v0/"
  }
})

// get a list of DAOs
arc.daos().subscribe(
  (daos) => console.log(`Here are your DAOS: ${daos}`)
)
```

## More information

* [overview](./documentation/overview.md)
* [development](./documentation/development.md)
* [small demo](./documentation/demo.js) 
* Generated documentation [TODO!]
