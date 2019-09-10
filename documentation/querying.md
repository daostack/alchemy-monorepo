# Querying The Graph


One of the two purposes of the client library is to make it easy to query the subgraph that contains the index of DAOstack data (the other purpose it to make it easy to write to the DAOstack contracts).

## Query examples:

```
dao.proposals()
arc.sendQuery(`daos { id name }`)
proposal.state()
```

## What this does

Calling each of these function by itself will not actually send the qeury to the server.
Instead, each query returns an *observable*, to which you can subscribe.
Only at that moment will the server be queried:

```
const observable = arc.daos()
// only in the nexzt line will a query be sent to the server
const subscription = arc.daos.subscribe((daos) => console.log(`we found ${daos.length} results`))
```

By default, subscribing to an observable will do to things:

1. It will send a query to the server, fetching the data
2. It will send a subscription query to the server, which will cause the server to send you an update each time the data changes


Because subscriptions can be expensive, this behavior can be turned off, so only the query will be sent.
```
const observable1 = arc.daos({}, { subscribe: false})
const observable2 = dao.state({subscribe: false})
```
In this example, observable2 will not open a subscription to the server

This does not mean that you will not get any updates to your subscription - the query will still watch the cache for changes, so if another query updates the cache, the observable will emit an updated result.
