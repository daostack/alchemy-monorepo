import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
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
    testAddresses = await getTestAddresses()
  })

  it('Scheme is instantiable', () => {
    const scheme = new Scheme(
      '0x1234id', // id
      arc
    )
    expect(scheme).toBeInstanceOf(Scheme)
  })

  it('Scheme are searchable', async () => {
    const dao = await getTestDAO()
    let result: Scheme[]
    result = await Scheme.search(arc, {where: {dao: dao.address}})
        .pipe(first()).toPromise()

    // TODO: we should expect 3 queus here, see https://github.com/daostack/subgraph/issues/195
    expect(result.length).toEqual(3)

    const schemeStates: ISchemeState[] = []

    await Promise.all(result.map(async (item) => {
      const state = await item.state().pipe(first()).toPromise()
      schemeStates.push(state)
    }))
    expect((schemeStates.map((r) => r.name)).sort()).toEqual([
      'GenericScheme',
      'ContributionReward',
      'SchemeRegistrar'
    ].sort())
    result = await Scheme.search(arc, {where: {dao: dao.address, name: 'ContributionReward'}})
        .pipe(first()).toPromise()
    expect(result.length).toEqual(1)

    result = await Scheme.search(arc, {where: {dao: dao.address, name: 'GenericScheme'}})
        .pipe(first()).toPromise()
    expect(result.length).toEqual(1)

    result = await Scheme.search(arc, {where: {dao: dao.address, name: 'SchemeRegistrar'}})
        .pipe(first()).toPromise()
    expect(result.length).toEqual(1)
  })

  it('Scheme.state() is working', async () => {
    const dao = await getTestDAO()
    const result = await Scheme
      .search(arc, {where: {dao: dao.address, name: 'SchemeRegistrar'}})
      .pipe(first()).toPromise()

    const scheme = result[0]
    const state = await scheme.state().pipe(first()).toPromise()
    expect(state).toMatchObject({
      address: testAddresses.base.SchemeRegistrar.toLowerCase(),
      id: scheme.id,
      name: 'SchemeRegistrar'
    })

  })

  it('Scheme.state() should be equal to proposal.state().scheme', async () => {
    const { queuedProposalId } = testAddresses.test
    const dao = await getTestDAO()
    const proposal = await dao.proposal(queuedProposalId)
    const proposalState = await proposal.state().pipe(first()).toPromise()
    const schemes = await firstResult(Scheme.search(arc, {where: {id: proposalState.scheme.id}}))
    const schemeState = await firstResult(schemes[0].state())
    expect(proposalState.scheme).toEqual(schemeState)
  })

  it('paging and sorting works', async () => {
    const ls1 = await Scheme.search(arc, { first: 3, orderBy: 'address' }).pipe(first()).toPromise()
    expect(ls1.length).toEqual(3)

    expect((await firstResult(ls1[0].state())).address <= (await firstResult(ls1[1].state())).address).toBeTruthy()

    const ls2 = await Scheme.search(arc, { first: 2, skip: 2, orderBy: 'address' }).pipe(first()).toPromise()
    expect(ls2.length).toEqual(2)
    expect((await firstResult(ls1[2].state())).address <= (await firstResult(ls2[0].state())).address).toBeTruthy()
    // expect(ls1[2].address).toEqual(ls2[0].address)

    const ls3 = await Scheme.search(arc, {  orderBy: 'address', orderDirection: 'desc'}).pipe(first()).toPromise()
    expect((await firstResult(ls3[0].state())).address <= (await firstResult(ls3[1].state())).address).toBeTruthy()
    // expect(ls3[0].address <= ls3[1].address).toBeTruthy()
  })

})
