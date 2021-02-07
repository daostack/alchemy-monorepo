import { first } from 'rxjs/operators'
import { Arc, DAO, Event, IEventState,
  IEventStaticState,
  Proposal } from '../src'
import { getTestAddresses, getTestDAO, ITestAddresses, newArc, toWei, waitUntilTrue } from './utils'

jest.setTimeout(20000)

/**
 * Event test
 */
describe('Event', () => {

  let arc: Arc
  let testAddresses: ITestAddresses
  let dao: DAO

  beforeAll(async () => {
    arc = await newArc()
    testAddresses = getTestAddresses(arc)
    dao = await getTestDAO()
  })

  it('Event is instantiable', () => {
    const id = 'some-id'
    const event = new Event(id, arc)
    expect(event).toBeInstanceOf(Event)
  })

  it('Events are searchable and have a state', async () => {

    // create a proposal with some events
    const beneficiary = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'
    const state = await dao.createProposal({
      beneficiary,
      dao: dao.id,
      ethReward: toWei('300'),
      externalTokenAddress: undefined,
      externalTokenReward: toWei('0'),
      nativeTokenReward: toWei('1'),
      scheme: testAddresses.base.ContributionReward,
      title: 'a-title'
    }).send()
    const proposal = state.result as Proposal

    expect(proposal).toBeDefined()

    let result: Event[] = []

    await waitUntilTrue(async () => {
      result = await Event.search(arc, { where: {proposal: proposal.id}}, {fetchPolicy: 'no-cache'})
        .pipe(first()).toPromise()
      return result.length > 0
    })
    expect(result.length).toEqual(1)
    const event = result[0]
    const eventState = await event.state().pipe(first()).toPromise()

    expect(eventState).toMatchObject({
      dao: dao.id,
      data: {title: 'a-title'},
      id: event.id,
      proposal: proposal.id,
      type: 'NewProposal'
    })

    expect(() => Event.search(arc, {where: {dao: ''}})).toThrowError(
      /not a valid address/i
    )
    result = await Event.search(arc, { where: {dao: dao.id}})
        .pipe(first()).toPromise()
    const allEvents = await Event.search(arc, {first: 1000}).pipe(first()).toPromise()
    expect(allEvents.length).toBeGreaterThan(result.length)

  })

  it('paging and sorting works', async () => {
    const ls1 = await Event.search(arc, { first: 3, orderBy: 'id' }).pipe(first()).toPromise()
    expect(ls1.length).toEqual(3)
    expect(ls1[0].id < ls1[1].id)

    const ls2 = await Event.search(arc, { first: 2, skip: 2, orderBy: 'id' }).pipe(first()).toPromise()
    expect(ls2.length).toEqual(2)
    expect(ls1[2].id === ls2[0].id)

    const ls3 = await Event.search(arc, {  orderBy: 'id', orderDirection: 'desc'}).pipe(first()).toPromise()
    expect(ls3[0].id >= ls3[1].id)
  })

  it('fetchStaticState works as expected', async () => {
    const events = await Event.search(arc).pipe(first()).toPromise()
    const event = events[0]
    // staticState should be set on search
    expect(event.staticState).toBeTruthy()

    // for events, the staticState is quel to the event state
    const state = await event.state().pipe(first()).toPromise()
    expect(state).toEqual(event.staticState)

    const eventFromId = new Event(event.id, arc)
    expect(eventFromId.staticState).not.toBeTruthy()
    await eventFromId.fetchStaticState()
    expect(eventFromId.staticState).toBeTruthy()
    const  eventFromStaticState = new Event(event.staticState as IEventState, arc)
    expect(eventFromStaticState.staticState).toBeTruthy()
  })

  it('arc.events() works', async () => {
    const eventsWithProposal = await arc.events({where: {proposal_not: null}}).pipe(first()).toPromise()
    expect(eventsWithProposal.length).toBeGreaterThan(1)
    const events1 = await arc
      .events({where: {proposal_in: [
        (eventsWithProposal[0].staticState as IEventStaticState).proposal,
        (eventsWithProposal[1].staticState as IEventStaticState).proposal
      ]}})
      .pipe(first()).toPromise()
    expect(events1.length).toBeGreaterThanOrEqual(2)
    expect(events1.length).toBeLessThan(eventsWithProposal.length)

    const eventsWithDAO = await arc.events({where: {proposal_not: null}}).pipe(first()).toPromise()
    expect(eventsWithDAO.length).toBeGreaterThan(1)
    const events2 = await arc
      .events({where: {dao_in: [
        (eventsWithDAO[0].staticState as IEventStaticState).dao,
        (eventsWithDAO[1].staticState as IEventStaticState).dao
      ]}})
      .pipe(first()).toPromise()
    expect(events2.length).toBeGreaterThanOrEqual(2)

    const eventsWithUser = await arc.events({where: {user_not: null}}).pipe(first()).toPromise()
    expect(eventsWithUser.length).toBeGreaterThan(1)
    const events3 = await arc
      .events({where: {user_in: [
        (eventsWithUser[0].staticState as IEventStaticState).user,
        (eventsWithUser[1].staticState as IEventStaticState).user
      ]}})
      .pipe(first()).toPromise()
    expect(events3.length).toBeGreaterThanOrEqual(2)

  })
})
