# Overview

The `@daostack/client` is a package that provides an interface to the
[DAOstack contracts](https://github.com/daostack/arc) and to the [DAOstack subgraph](https://github.com/daostack/subgraph).


## Installation


The client package can be used as a dependency for developing a client application
(we are using it to build a [React application](https://github.com/daostack/alchemy) called [Alchemy](https://alchemy.daostack.io)),
but it can also be used for writing nodejs scripts that interact with the contracts or for querying data from the subgraph.


The first thing to do is install the package:

```sh
npm install @daostack/client -g
```

## General structure

The main purpose of the `@daostack/client` library is to provide helpful tools to interact with the DAOstack ecosystem.

For that purpose, we provide a number of Classes that represent a number of basic entities - these are the basic building blocks of a DAO, if you will.
These are the following classes: `DAO`, `Member`, `Proposal`, `Queue`,  `Scheme`, `Reputation`, `Reward`, `Stake` and `Vote`.


### Configuration: the Arc object

Before interacting with the contracts on-chain and the indexing service,  is the `Arc` object that holds the basic configuration (which services to connect to) and serves as the main entrypoint when using the library.

A typical way of configuring a new Arc instance is as follows:

```
import { Arc } from '@daostack/client'

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
```
Note how we are passing to Arc all the information it needs to connect to the various services: websocket and http connections to the subgraph of The Graph;
the connection to the Ethereum node, and a connection to an ipfs Provider (which is used to as a data storage layer by DAOStack).

Some of these configuration settings are optional.
Without the graphql services, it is still possible to use `@daostack/client` for creating and sending transactions to the blockchain;
similarly, the `web3` and `ipfs` providers can be omitted when the library is only used for fetching data from the subgraph.



### Proposals, Schemes, Votes, Stakes, Queues, etc

These classes all implement the same patterns.


All classes implement `search`  function as a class method, which can be used to search for those entities on the subgraph.
For example, to get all DAOs that are called `Foo`, you can do:

```
import { Arc, DAO } from '@doastack/client'
const arc = new Arc({.....})
DAO.search(arc, {where: { name: "Foo" }})
```
Note how the search function must be provided with an `Arc` instance, so it knows to which service to send the queries.

All queries return (rxjs.Observable)[http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html] instances. (See below)[#search] for further explanation.

### Class instances

All Entity class instances in the client library can be created in two different ways.

The first way is by providing an `id` (and an instance of `Arc`), for example:

```
const proposal = new Proposal('0x1234....', arc)
```
The proposal object can now be used to vote.
```
await proposal.vote(...).send()
```
This call will register a vote by sending a transaction to the blockchain.
Again, see below for more details.

Because the proposal is created with only an `id`, the client will query the subgraph for additional information, such as the address of the contract that the vote needs to be sent to.

To make the client usable without having subgraph service available, all Entities have a second way of being created:
```
const proposal = new Proposal({
  id: '0x12455',
  votingMachine: '0x1111',
  scheme: '0x12345'
  }, arc)
```
This will provide the instance with enough information to send transactions without having to query the subgraph for additional information.



## Searching and observables


Here are some examples of queries:
```
Proposal.search({ where: { dao: '0x1234..' }})
```

```
  dao.proposals({ where: { scheme: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'}})
  dao.proposals({ where: { scheme_in: ['0xffcf8fdee72ac11b5c542428b35eef5769c409f0']}})
```

Paging
```
  dao.proposals({ skip: 100, first: 100})
```

Sorting:
```
  dao.proposals({ orderBy: 'createdAt', orderDirection: 'desc'})
```

All these queries return an (rxjs `Observable`)[https://rxjs-dev.firebaseapp.com/guide/observable] object.

This observables return a stream of results: everytime the data in the query gets updated, the observable will emit a new result.
Observables are very flexible.
Typically, an observable will be used by creating a subscription:

```
const observable =  dao.proposals() // all proposals in this dao

// a subscription
const subscription = observable.subscribe(
  (next) => console.log(`Found ${next.length} proposals`) // will be called each time the data from the qeury changes
)
subscription.unsubscribe() // do not forget to unsubscribe
```
If you are only interested in the first result, but do not want to get further updates when the data is changed, there is a helper function that returns a Promise
with the first result
```
const observable =  dao.proposals() // all proposals in this dao
const proposals = await observable.first() // returns a list of Proposal instances
```

## Sending transactions

One of the purposes of the client library is to make help with interactions with the DAOstack Ethereum contracts.

Here is how you create a proposal in a DAO  for a contribution reward for a


```
const DAO = new DAO('0x123DAOADDRESS')
dao.createProposal({
  beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
  ethReward: toWei('300'),
  externalTokenAddress: undefined,
  externalTokenReward: toWei('0'),
  nativeTokenReward: toWei('1'),
  periodLength: 0,
  periods: 1,
  reputationReward: toWei('10'),
  scheme: '0xContributionRewardAddress' // address of a contribution reward scheme that is registered with this DAO
})
```
