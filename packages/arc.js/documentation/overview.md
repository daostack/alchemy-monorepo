# Overview

The main purpose of the `@daostack/client` package is to provide a helpful set of tools to interact with the DAOstack ecosystem.

In particular, the  library provides an interface to
 the [DAOstack contracts](https://github.com/daostack/arc)
and to the [DAOstack subgraph](https://github.com/daostack/subgraph) (an index of on-chain data).


## Installation


```sh
npm install @daostack/client
```
The client package can be used as a dependency for developing a client application
(we are using it to build a [React application](https://github.com/daostack/alchemy) called [Alchemy](https://alchemy.daostack.io)),
but it can also be used for writing nodejs scripts that interact with the contracts or for querying data from the subgraph.


## General structure

The client library provides a number of Classes that represent a the DAOstack basic entities - these are the basic building blocks of a DAO.

A  `DAO` has a number of `Member`, which are holders of reputation (from the `Reputation` contract) and can cast a `Vote` on a  `Proposal`.
Proposals are always made in a `Scheme` - that determines the conditions and effects of executing a proposal, typically by ordering them in a  `Queue`.
Users can also put a `Stake` on the outcome of a proposal, and claim one or more `Reward` if they vote or stake effectively.


### Configuration: the Arc object

**if you are a developer, you may also be interested in the [demo file](./demo.js)**

Before interacting with the contracts on-chain and the indexing service,
the user of the library must provide some basic configration options.
The `Arc` object that holds the basic configuration (which services to connect to) and serves as the main entrypoint when using the library.


The current (at the time of writing) version of [Alchemy](https://alchemy.daostack.io) uses the following configuration:
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

// before we can use the Arc instance to send transactions, we need to provide it
// with information on where the contracts can be found
// query the subgraph for the contract addresses, and use those
await arc.fetchContractInfos()
```
Note how we are passing to Arc all the information it needs to connect to the various services: the web3Provider represents a  connection to an Ethereum node,  websocket and http connections to the subgraph of The Graph;
and a connection to an IPFS provider (which is used to as a data storage layer by DAOStack).

Some of these configuration settings are optional: to use `@daostack/client` for creating and sending transactions to the blockchain, it is sufficient
to provide the web3Provider;
similarly, the `web3` and `ipfs` providers can be omitted when the library is only used for fetching data from the subgraph.



### Proposals, Schemes, Votes, Stakes, Queues, etc


All basic Entity classes in the client library implement a number of common functions.

For example, all these classes implement a `search`  function as a class method, which can be used to search for those entities on the subgraph.
To get all DAOs that are called `Foo`, you can do:

```
import { DAO } from '@doastack/client'
DAO.search(arc, {where: { name: "Foo" }})
```
Note how the search function must be provided with an `Arc` instance, so it knows to which service to send the queries.

All queries return [rxjs.Observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html).
[See below](#search) for further explanation.

### Class instances

All Entity classes can be created by providing an `id` (and an instance of `Arc`), for example:

```
const proposal = new Proposal('0x1234....', arc)
```
The proposal object can now be used to vote, and stake.
```
await proposal.vote(...).send()
```
This call will register a vote by sending a transaction to the blockchain.
Again, see below for more details.

Because the proposal is created with only an `id`, the client will query the subgraph for additional information, such as the address of the contract that the vote needs to be sent to. To make the client usable without having subgraph service available, all Entities have a second way of being created:
```
const proposal = new Proposal({
  id: '0x12455..',
  votingMachine: '0x1111..',
  scheme: '0x12345...'
  }, arc)
```
This will provide the instance with enough information to send transactions without having to query the subgraph for additional information.


## Entity states

All entities implement a `state()` method that returns an observable of objects that represent the current state of the entity.

```
proposal.state().subscribe(
  (newState) => console.log(`This proposal has ${newState.votesFor} upvotes`)
  )
```
```
dao.state().subscribe(
  (newState) => console.log(`This DAO has ${newState.memberCount} members`)
  )
```

## Searching and observables

The search functions are wrappers around graphql queries, and standard graphql syntax can be used
to filter and sort the queries, and for pagination:
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
  (next) => console.log(`Now there are ${next.length} proposals`) // will be called each time the data from the qeury changes
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
const tx = dao.createProposal({
  beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
  ethReward: toWei('300'),
  nativeTokenReward: toWei('1'),
  periodLength: 0,
  periods: 1,
  reputationReward: toWei('10'),
  scheme: '0xContributionRewardAddress' // address of a contribution reward scheme that is registered with this DAO
})
```

All functions that send a transaction to the blockchain (like `DAO.createProposal`, `Proposal.vote`, `Token.mint`, etc, etc) return an rxjs Observable. This observable returns a stream of updates about the state of the transaction: first when it is sent, then when it is mined and confirmed.

You can subscribe to the transaction:

```
tx.subscribe(
  (next) => {
    console.log(next.state) // sending, sent, or mined
    if (next.stage === ITransactionStage.Mined) {
      console.log(`This transaction has ${next.confirmations} confirmations`)
      console.log(next.result)
    }
  })
  ```

All operations also provide a convenience function `send()` that returns a promise that resolves when the transaction is mined
```
const voteTransaction = await proposal.vote(...).send()
const vote = voteTransaction.result // an instance of Vote
```

For more docuemntatation, see the generated docs [TODO]
