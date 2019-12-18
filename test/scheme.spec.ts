import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { IProposalStage } from '../src/proposal'
import { ISchemeState, Scheme } from '../src/scheme'
import { firstResult, getTestAddresses, getTestDAO,  ITestAddresses, newArc } from './utils'

jest.setTimeout(20000)

/**
 * Scheme test
 */
describe('Scheme', () => {

  let arc: Arc
  let testAddresses: ITestAddresses

  beforeAll(async () => {
    arc = await newArc()
    testAddresses = await getTestAddresses(arc)
  })

  it('Scheme is instantiable', () => {
    const scheme = new Scheme(
      '0x1234id', // id
      arc
    )
    expect(scheme).toBeInstanceOf(Scheme)
  })

  it('Schemes are searchable', async () => {
    const dao = await getTestDAO()
    let result: Scheme[]
    result = await Scheme.search(arc, {where: {dao: dao.id, name_not: null}})
        .pipe(first()).toPromise()

    expect(result.length).toBeGreaterThanOrEqual(3)

    // the schemes have their static state set
    const staticState = await result[0].fetchStaticState()
    expect(staticState.name).toBeTruthy()
    expect(staticState.address).toBeTruthy()
    expect(staticState.id).toBeTruthy()
    expect(staticState.dao).toBeTruthy()
    expect(staticState.paramsHash).toBeTruthy()

    const schemeStates: ISchemeState[] = []

    await Promise.all(result.map(async (item) => {
      const state = await item.state().pipe(first()).toPromise()
      schemeStates.push(state)
    }))
    expect((schemeStates.map((r) => r.name)).sort()).toEqual([
      'ContributionReward',
      'SchemeRegistrar',
      'UGenericScheme'

    ].sort())
    result = await Scheme.search(arc, {where: {dao: dao.id, name: 'ContributionReward'}})
        .pipe(first()).toPromise()
    expect(result.length).toEqual(1)

    result = await Scheme.search(arc, {where: {dao: dao.id, name: 'UGenericScheme'}})
        .pipe(first()).toPromise()
    expect(result.length).toEqual(1)

    result = await Scheme.search(arc, {where: {dao: dao.id, name: 'SchemeRegistrar'}})
        .pipe(first()).toPromise()
    expect(result.length).toEqual(1)
    result = await Scheme.search(arc, {where: {dao: dao.id, name_in: ['SchemeRegistrar', 'UGenericScheme']}})
        .pipe(first()).toPromise()
    expect(result.length).toEqual(2)
    result = await Scheme.search(arc, {where: {dao: dao.id, name_not_in: ['UGenericScheme']}})
        .pipe(first()).toPromise()
    expect(result.length).toBeGreaterThan(1)
  })

  it('Scheme.state() is working for ContributionReward schemes', async () => {
    const dao = await getTestDAO()
    const result = await Scheme
      .search(arc, {where: {dao: dao.id, name: 'ContributionReward'}})
      .pipe(first()).toPromise()

    const scheme = result[0]
    const state = await scheme.state().pipe(first()).toPromise()
    expect(state).toMatchObject({
      address: testAddresses.base.ContributionReward.toLowerCase(),
      id: scheme.id,
      name: 'ContributionReward'
    })
    expect(state.contributionRewardParams).toEqual(state.schemeParams)
  })

  it('Scheme.state() is working for SchemeRegistrar schemes', async () => {
    const dao = await getTestDAO()
    const result = await Scheme
      .search(arc, {where: {dao: dao.id, name: 'SchemeRegistrar'}})
      .pipe(first()).toPromise()

    const scheme = result[0]
    const state = await scheme.state().pipe(first()).toPromise()
    expect(state).toMatchObject({
      address: testAddresses.base.SchemeRegistrar.toLowerCase(),
      id: scheme.id,
      name: 'SchemeRegistrar'
    })
    expect(state.schemeRegistrarParams).toEqual(state.schemeParams)
  })

  it('Scheme.state() is working for UGenericScheme schemes', async () => {
    const result = await Scheme
      .search(arc, {where: {name: 'UGenericScheme'}})
      .pipe(first()).toPromise()
    const scheme = result[0]
    const state = await scheme.state().pipe(first()).toPromise()
    expect(state).toMatchObject({
      id: scheme.id,
      name: 'UGenericScheme'
    })

    expect(state.uGenericSchemeParams).toEqual(state.schemeParams)
  })

  it('Scheme.state() is working for GenericScheme schemes', async () => {
    const result = await Scheme
      .search(arc, {where: {name: 'GenericScheme'}})
      .pipe(first()).toPromise()

    const scheme = result[0]
    const state = await scheme.state().pipe(first()).toPromise()
    expect(state).toMatchObject({
      id: scheme.id,
      name: 'GenericScheme'
    })

    // the subgraph is a bit weird here, popoulating uGenericSchemeParams instead of the expected schemeParams
    expect(state.genericSchemeParams).toEqual(state.schemeParams)
  })

  it('state() should be equal to proposal.state().scheme', async () => {
    const { queuedProposalId } = testAddresses.test
    const dao = await getTestDAO()
    const proposal = await dao.proposal(queuedProposalId)
    const proposalState = await proposal.state().pipe(first()).toPromise()
    const schemes = await firstResult(Scheme.search(arc, {where: {id: proposalState.scheme.id}}))
    const schemeState = await firstResult(schemes[0].state())
    expect(schemeState).toMatchObject(proposalState.scheme)
  })

  it('numberOfProposals counts are correct', async () =>  {
    const { queuedProposalId } = testAddresses.test
    const dao = await getTestDAO()
    const proposal = await dao.proposal(queuedProposalId)
    const proposalState = await proposal.state().pipe(first()).toPromise()
    const schemes = await firstResult(Scheme.search(arc, {where: {id: proposalState.scheme.id}}))
    const scheme = schemes[0]
    const schemeState = await firstResult(scheme.state())

    const queuedProposals = await scheme.proposals({ where: { stage: IProposalStage.Queued}, first: 1000})
      .pipe(first()).toPromise()
    expect(schemeState.numberOfQueuedProposals).toEqual(queuedProposals.length)
    const preBoostedProposals = await scheme.proposals({ where: { stage: IProposalStage.PreBoosted}, first: 1000})
      .pipe(first()).toPromise()
    expect(schemeState.numberOfPreBoostedProposals).toEqual(preBoostedProposals.length)
    const boostedProposals = await scheme.proposals({ where: { stage: IProposalStage.Boosted}, first: 1000})
      .pipe(first()).toPromise()
    expect(schemeState.numberOfBoostedProposals).toEqual(boostedProposals.length)
  })

  it('paging and sorting works', async () => {
    const ls1 = await Scheme.search(arc, { first: 3, orderBy: 'address' }).pipe(first()).toPromise()
    expect(ls1.length).toEqual(3)

    expect((await firstResult(ls1[0].state())).address <= (await firstResult(ls1[1].state())).address).toBeTruthy()

    const ls2 = await Scheme.search(arc, { first: 2, skip: 2, orderBy: 'address' }).pipe(first()).toPromise()
    expect(ls2.length).toEqual(2)
    expect((await firstResult(ls1[2].state())).address <= (await firstResult(ls2[0].state())).address).toBeTruthy()

    const ls3 = await Scheme.search(arc, {  orderBy: 'address', orderDirection: 'desc'}).pipe(first()).toPromise()
    expect((await firstResult(ls3[0].state())).address >= (await firstResult(ls3[1].state())).address).toBeTruthy()
  })

  it('fetchStaticState works', async () => {
    const schemes = await firstResult(Scheme.search(arc))
    const scheme = schemes[0]
    const state = await scheme.fetchStaticState()
    expect(Object.keys(state)).toContain('address')
  })

  it('fetchAllData works', async () => {
    const schemes = await Scheme.search(arc, {}, { fetchAllData: true }).pipe(first()).toPromise()
    const scheme = schemes[0]
    // now we have all data in the cache - and we can get the whole state from the cache without error
    const schemeStateFromCache = await scheme.state({ fetchPolicy: 'cache-only'}).pipe(first()).toPromise()
    const schemeStateFromServer = await scheme.state({ fetchPolicy: 'no-cache'}).pipe(first()).toPromise()
    expect(schemeStateFromCache).toEqual(schemeStateFromServer)
  })

})
