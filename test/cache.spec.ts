import { getMainDefinition } from 'apollo-utilities'
// import gql from 'graphql-tag'
import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import {DAO } from '../src/dao'
import { createApolloClient } from '../src/graphnode'
import { Member } from '../src/member'
import { Proposal } from '../src/proposal'
import { getContractAddressesFromMigration } from '../src/utils'
import { Vote } from '../src/vote'
import { graphqlHttpProvider, graphqlWsProvider, waitUntilTrue } from './utils'

jest.setTimeout(20000)
/**
 * Tests to see if the apollo cache works as expected
 */
describe('apolloClient caching checks', () => {

  let arc: any
  let networkSubscriptions: any[] = []
  let networkQueries: any[] = []

  beforeEach(async () => {
    networkSubscriptions = []
    networkQueries = []
    arc = new Arc({
      contractInfos: getContractAddressesFromMigration('private'),
      graphqlHttpProvider,
      graphqlWsProvider,
      ipfsProvider: '',
      web3Provider: 'ws://127.0.0.1:8545'
    })

    arc.apolloClient = createApolloClient({
      graphqlHttpProvider,
      graphqlWsProvider,
      graphqlPrefetchHook: (query: any) => {
        const definition = getMainDefinition(query)
        // console.log(query)
        // @ts-ignore
        if (definition.operation === 'subscription') {
          networkSubscriptions.push(definition)
        } else {
          networkQueries.push(definition)
        }
        // console.log(definition)
      }
    })
  })

  it('pre-fetching DAOs works', async () => {
    // const client = arc.apolloClient
    // get all DAOs
    const daos = await arc.daos().pipe(first()).toPromise()

    // we will still hit the server when getting the DAO state, because the previous query did not fetch all state data
    // so the next line with 'cache-only' will throw an Error
    const p = arc.dao(daos[0].id).state({ fetchPolicy: 'cache-only'}).pipe(first()).toPromise()
    expect(p).rejects.toThrow()

    // now get all the DAOs with defailed data
    await arc.daos({}, { fetchAllData: true }).pipe(first()).toPromise()
    // now we have all data in the cache - and we can get the whole state from the cache without error
    await arc.dao(daos[0].id).state({ fetchPolicy: 'cache-only'}).pipe(first()).toPromise()
  })

  it('pre-fetching Proposals works', async () => {

    const proposals = await Proposal.search(arc).pipe(first()).toPromise()
    const proposal = proposals[0]
    // so the next line with 'cache-only' will throw an Error
    const p = proposal.state({ fetchPolicy: 'cache-only'}).pipe(first()).toPromise()
    expect(p).rejects.toThrow()

    // now get all the DAOs with defailed data
    await Proposal.search(arc, {}, { fetchAllData: true }).pipe(first()).toPromise()
    // now we have all data in the cache - and we can get the whole state from the cache without error
    await proposal.state({ fetchPolicy: 'cache-only'}).pipe(first()).toPromise()
  })

  it('pre-fetching Members with Member.search() works', async () => {

    // get all members of the dao
    const members = await Member.search(arc).pipe(first()).toPromise()
    const member = members[0]

    // we will still hit the server when getting the DAO state, because the previous query did not fetch all state data
    // so the next line with 'cache-only' will throw an Error
    expect(member.id).toBeTruthy()
    // await new Member(member.id as string , arc).state().pipe(first()).toPromise()
    await new Member(member.id as string , arc).state({ fetchPolicy: 'cache-only'}).pipe(first()).toPromise()
  })

  it('pre-fetching ProposalVotes works', async () => {
    // get all votes of a member
    const votes = await Vote.search(arc).pipe(first()).toPromise()
    const vote = votes[0] as Vote
    // console.log(vote.staticState)
    // @ts-ignore
    const dao = new DAO(vote.staticState.dao as string, arc)
    // @ts-ignore
    const proposal = new Proposal(vote.staticState.proposal, arc)
    // @ts-ignore
    const member = dao.member(vote.staticState.voter)
    expect(networkQueries.length).toEqual(1)
    expect(networkSubscriptions.length).toEqual(1)
    let hasResults = false
    await member.votes().subscribe(() => hasResults = true)
    await waitUntilTrue(() => hasResults)
    expect(networkQueries.length).toEqual(2)
    expect(networkSubscriptions.length).toEqual(2)

    // if we now get the vote of this member for a particualr proposal, we should not send a query at all
    // @ts-ignore
    await proposal.votes({ where: { voter: vote.staticState.voter}})
    // console.log(networkQueries)
    // @ts-ignore
    // console.log(arc.apolloClient.cache.data.data)

  })

  it('pre-fetching Members with dao.members() works', async () => {

    expect(networkSubscriptions.length).toEqual(0)
    expect(networkQueries.length).toEqual(0)
    const daos = await arc.daos({}, { subscribe: false, fetchAllData: true}).pipe(first()).toPromise()
    expect(networkSubscriptions.length).toEqual(0)
    expect(networkQueries.length).toEqual(1)
    const dao = daos[0]
    expect(dao.staticState).toBeTruthy()

    const members = await dao.members({}, {subscribe: false}).pipe(first()).toPromise()
    // we now should have sent a subscriptino for dao.members()

    const member = members[1]
    // subscribe to all (well, the first 100) members and member changes
    await dao.members({}, {subscribe: true }).subscribe()
    expect(networkQueries.length).toEqual(2)
    expect(networkSubscriptions.length).toEqual(1)
    // if we now get the member state, we should not be sending any query at all
    await member.state({ fetchPolicy: 'cache-only', subscribe: false}).subscribe()
    expect(networkQueries.length).toEqual(2)
    expect(networkSubscriptions.length).toEqual(1)
    await member.state({ subscribe: false}).subscribe()
    expect(networkQueries.length).toEqual(2)
    expect(networkSubscriptions.length).toEqual(1)

    // TODO: dieally, we would also be smart enough to not subscribe to an individaul state if we
    // are already subscribed ...
    // await member.state().subscribe()
    // expect(networkQueries.length).toEqual(2)
    // expect(networkSubscriptions.length).toEqual(1)

    // for sanity, check fi we actually ahve the member info
    const memberState = await member.state({fetchPolicy: 'cache-only', subscribe: false}).pipe(first()).toPromise()
    expect(memberState.reputation.isZero()).toBeFalsy()
    // getting the member by address does not open a new subscription either
    await dao.member(memberState.address).state({ subscribe: false}).pipe(first()).toPromise()
    expect(networkQueries.length).toEqual(2)
    expect(networkSubscriptions.length).toEqual(1)

  })

  it('try to understand the caching of queries', async () => {
    const arc = new Arc({
      contractInfos: getContractAddressesFromMigration('private'),
      graphqlHttpProvider,
      graphqlWsProvider,
      ipfsProvider: '',
      web3Provider: 'ws://127.0.0.1:8545'
    })

    // const daos = await arc.daos().pipe(first()).toPromise()
    // const daoId = '0xa92a766d62318b9c06eb548753bd34acbd7c5f3c'
    const daoName = 'Querulous Unicorn'
    // const dao1 = daos[0]
    // const dao2 = daos[0]
    // so if i get the same query twice, the second time I should get the result from the cache
    // await arc.daos({where: { id: dao1.id }}).pipe(first()).toPromise()
    // await arc.daos({where: { id: dao1.id }}, { fetchPolicy: 'cache-only'}).pipe(first()).toPromise()
    // console.log(rs2)
    // let x
    if (arc.apolloClient) {
      // const client = arc.apolloClient
      arc.daos({ where: { name: daoName}}).subscribe()
      // (dao: any) =>
        // console.log(dao)
      // )
      // x = await arc.apolloClient.query({
      //   // fetchPolicy: 'xx-only',
      //   query: gql`query daoQuery {dao (id: "${daoId}") { id name }}`
      //   // variables: { id: dao1.id}
      // })
      // console.log(x)
      // x = await client.readQuery({
      //   query: gql`query daoQuery($id: String!) {dao (id:$id) { id name }}`,
      //   variables: { id: daoId}
      // })
      // let query: any
      // query = gql`query daoQuery ($name: String! ) {daos  @client (where: {name: $name})  { id name }}`
      // x = await client.query({query, variables: {name: daoName}})
      // console.log(x)
      // console.log(`readQuery: ...............................`)
      // await client.readQuery({query, variables: {name: daoName}})
      // console.log(await client.getResolvers())
      // @ts-ignore
      // console.log(client.cache.config.cacheRedirects)
      // await client.readQuery({query})
      // arc.apolloClient.writeQuery({query, data: [x]})
      // console.log('-------------------')
      // x = await client.query({ query })
      // console.log(x)
      // console.log(`queries`)
      // @ts-ignore
      // console.log(client.queryManager.queries)

    }
    // @ts-ignore
    // console.log(arc.apolloClient.cache.data.data)
    // @ts-ignore
    // console.log(arc.apolloClient.cache.data.data.ROOT_QUERY)
    // throw Error('faillllle')
  })
})
    // const client = arc.apolloClient
    // function getQueries() {
    //   // @ts-ignore
    //   return client.queryManager.queries
    // }
    // we should have one query running, with one subscription
    // const queries = getQueries()
    // expect(queries.size).toEqual(1)
    // const entries = Array.from(queries.entries())
    // @ts-ignore
    // console.log(entries[0][1].subscriptions.size)
    // console.log(getQueries())
    // @ts-ignore
    // expect(entries[0][1].subscriptions.size).toEqual(1)
    // @ts-ignore
    // console.log(Array.from(entries[0][1].subscriptions)[0])

    // now get an invidual member
    // subscribe to this member

    // console.log(getQueries())
    // for (const query of [...queries.values()]) {
    //   console.log('xxx')
    //   console.log(query)
    // }
    // const member = members[0]

    // we will still hit the server when getting the DAO state, because the previous query did not fetch all state data
    // so the next line with 'cache-only' will throw an Error
    // expect(member.id).toBeTruthy()
    // await new Member(member.id as string , arc).state().pipe(first()).toPromise()
    // await new Member(member.id as string , arc).state({ fetchPolicy: 'cache-only'}).pipe(first()).toPromise()
