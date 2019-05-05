```js
const Arc = require('@daostack/client').Arc

// create an Arc instanc with the right settings
const arc = new Arc({
  graphqlHttpProvider: 'https://url.to.graphql.subgraph/',
  graphqlWsProvider: 'https://url.to.graphql.subgraph.websocket/',
  web3Provider: 'ws://url.to.web3.node/',
})

// get an Observable for list of DAOs
const daoObservable = arc.daos()
// we get the first return item from the obervable
const { first } = require('rxjs/operators')
const daos = await arc.daos().pipe(first()).toPromise()

// you can query for a particular DAO
arc.daos({ name: 'mydao'})

// or if you know the address, just create a new DAO object like this:
const dao = arc.dao(daos[0].address)

// get the DAO state
const state  = await dao.state.pipe(first()).toPromise()
// the state contains information such as the address, name or nativeToken of the DAO
const { address, name, token }  = state

// proposals
// get a Observable of proposals that are active but not boosted
const proposalsObservable = await dao.proposals({ active: true, boosted: false })
const currentProposals = proposalsObservable.pipe(first()).toPromise()

// proposals have a state know some basic things about themselves
const { title, description, votesFor } = await proposals[0].state.pipe(first()).toPromise()

// we can query for related data collection
proposal.stakes() // observable with a list of stakes
proposal.votes() // observable with a list of votes

// you can subscribe to state changes
const sub = proposal.state.subscribe(
  (next) => console.log(`new state! ${next}`),
  (err) => console.log(`error :-( ${err})`),
  () => console.log(`completed`)
)

// don't forget to unsubscribe
sub.unsubscribe()

```
