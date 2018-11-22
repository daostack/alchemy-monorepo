```js
const Arc = require('@daostack/client').Arc

const arc = new Arc({
  graphqlProvider: 'https://url.to.graphql.subgraph/',
  web3Provider: 'https://url.to.web3.node/',
})

// get an Observable list of DAOs
const daoObservable = arc.daos()
// or just get the list itself
const daos = await arc.daos().toPromise()

// you can query for a particular DAO
dsc.daos({ name: 'mydao'})

const dao = await dsc.dao(daos[0].address)

// get the DAO state
const state  = await dao.state.toPromise()
// the state contains the name of the DAO
const { name }  = await dao.state.toPromise()

// proposals
// get a Observable of proposals that are active but not boosted
const proposals = await dao.proposals({ active: true, boosted: false }).toPromise()

// proposals have a state know some basic things about themselves
const { title, description, votesFor } = await proposals[0].toPromise()

// we can query for related data collection
proposal.stakes() // observable with a list of stakes
proposal.votes() // observable with a list of votes

// you can subscribe to state changes
const sub = proposal.state.subscribe(
  next => console.log(`new state! ${next}`),
  err => console.log(`error :-( ${err})`),
)

sub.unsubscribe()

```
