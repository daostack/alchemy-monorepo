import { getMainDefinition } from 'apollo-utilities'
import gql from 'graphql-tag'
import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { createApolloClient } from '../src/graphnode'
import { Member } from '../src/member'
import { Proposal } from '../src/proposal'
import { Scheme } from '../src/scheme'
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
    // find a proposal in a scheme that has some votes
    const votes = await Vote.search(arc).pipe(first()).toPromise()
    const vote = votes[0] as Vote
    const voteState = await vote.state().pipe(first()).toPromise()
    const voterAddress = voteState.voter
    const proposal = new Proposal(voteState.proposal, arc)
    const proposalState = await proposal.state().pipe(first()).toPromise()
    const scheme = new Scheme(proposalState.scheme.id, arc)

    // now we have our objects, reset the cache
    await arc.apolloClient.cache.reset()
    expect(arc.apolloClient.cache.data.data).toEqual({})

    // construct our superquery
    const query = gql`query {
      proposals (where: { scheme: "${scheme.id}"}){
        ...ProposalFields
        votes (where: { voter: "${voterAddress}"}) {
          ...VoteFields
        }
        }
      }
      ${Proposal.fragments.ProposalFields}
      ${Vote.fragments.VoteFields}
    `
    let subscribed = false
    //
    arc.getObservable(query, { subscribe: true }).subscribe((x: any) => {
      subscribed = true
    })
    await waitUntilTrue(() => subscribed)

    // we now get all proposal data without hitting the cache
    const proposalData = await proposal.state({ fetchPolicy: 'cache-only'}).pipe(first()).toPromise()
    expect(proposalData.scheme.id).toEqual(scheme.id)
    //
    // const voteQuery = gql`query {
    //   proposal (id: "${proposal.id}") {
    //     votes (where: { voter: "${voterAddress}"}) {
    //       id
    //     }
    //   }
    // }
    // `
    // const xxx = await arc.getObservable(voteQuery, { fetchPolicy: 'cache-only' }).pipe(first()).toPromise()
    // console.log(xxx.data.proposal)
      // console.log(arc.apolloClient.cache.data.data)
    const proposalVotes = await proposal.votes({ where: { voter: voterAddress}}, { fetchPolicy: 'cache-only'})
      .pipe(first()).toPromise()
    // console.log(proposalVotes)
    expect(proposalVotes.map((v: Vote) => v.id)).toContain(vote.id)
    // get the votes of the proposal for our member
    // console.log(vote.staticState)
    // @ts-ignore
    const dao = new DAO(vote.staticState.dao as string, arc)
    // @ts-ignore
    // @ts-ignore
    const member = dao.member(vote.staticState.voter)
    // expect(networkQueries.length).toEqual(1)
    // expect(networkSubscriptions.length).toEqual(1)
    let hasResults = false
    await member.votes().subscribe(() => hasResults = true)
    await waitUntilTrue(() => hasResults)
    // expect(networkQueries.length).toEqual(2)
    // expect(networkSubscriptions.length).toEqual(2)

    // if we now get the vote of this member for a particualr proposal, we should not send a query at all
    // @ts-ignore
    // await proposal.votes({ where: { voter: vote.staticState.voter}})
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
})
