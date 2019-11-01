import { getMainDefinition } from 'apollo-utilities'
import gql from 'graphql-tag'
import { first } from 'rxjs/operators'
import { Member, Proposal, Scheme, Stake } from '../src'
import { createApolloClient } from '../src/graphnode'
import { Vote } from '../src/vote'
import { graphqlHttpProvider, graphqlWsProvider, newArc, waitUntilTrue } from './utils'

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
    arc = await newArc({
      graphqlHttpProvider,
      graphqlWsProvider,
      ipfsProvider: '',
      web3Provider: 'ws://127.0.0.1:8545'
    })
  })

  it('pre-fetching DAOs works', async () => {
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
    // find a proposal in a scheme that has > 1 votes
    let proposals = await Proposal.search(arc, {}, { fetchAllData: true }).pipe(first()).toPromise()
    // @ts-ignore
    proposals = proposals.filter((p) => p.staticState.votes.length > 1)
    const proposal = proposals[0]
    // @ts-ignore
    const vote = new Vote(proposals[0].staticState.votes[0], arc)
    const voteState = await vote.state().pipe(first()).toPromise()
    const voterAddress = voteState.voter
    const proposalState = await proposal.state().pipe(first()).toPromise()
    const scheme = new Scheme(proposalState.scheme.id, arc)

    // now we have our objects, reset the cache
    await arc.apolloClient.cache.reset()
    expect(arc.apolloClient.cache.data.data).toEqual({})

    // construct our superquery
    const query = gql`query {
      proposals (where: { scheme: "${scheme.id}"}){
        ...ProposalFields
        stakes { ...StakeFields }
        votes (where: { voter: "${voterAddress}"}) {
          ...VoteFields
          }
        }
      }
      ${Proposal.fragments.ProposalFields}
      ${Vote.fragments.VoteFields}
      ${Stake.fragments.StakeFields}
    `
    let subscribed = false
    const results: any[] = []
    arc.getObservable(query, { subscribe: true, fetchPolicy: 'no-cache'}).subscribe((x: any) => {
      subscribed = true
      results.push(x)
    })
    await waitUntilTrue(() => subscribed)
    const proposalVotes = await proposal.votes({ where: { voter: voterAddress}}, { fetchPolicy: 'cache-only'})
      .pipe(first()).toPromise()
    expect(proposalVotes.map((v: Vote) => v.id)).toEqual([vote.id])

    await proposal
      .votes({ where: { voter: '0x2a5994b501e6a560e727b6c2de5d856396aadd38' }})
      .pipe(first()).toPromise()
    await proposal.stakes({}, { fetchPolicy: 'cache-only'})
      .pipe(first()).toPromise()
    await proposal.stakes({where: { staker: voterAddress }})
      .pipe(first()).toPromise()
  })

  it('pre-fetching Members with dao.members() works', async () => {

    arc.apolloClient = createApolloClient({
      graphqlHttpProvider,
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
      },
      graphqlWsProvider
    })
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

    // for sanity, check fi we actually ahve the member info
    const memberState = await member.state({fetchPolicy: 'cache-only', subscribe: false}).pipe(first()).toPromise()
    expect(memberState.reputation.isZero()).toBeFalsy()
    // getting the member by address does not open a new subscription either
    await dao.member(memberState.address).state({ subscribe: false}).pipe(first()).toPromise()
    expect(networkQueries.length).toEqual(2)
    expect(networkSubscriptions.length).toEqual(1)

  })
})
