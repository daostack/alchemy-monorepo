const DAOstackMigration = require('@daostack/migration')
import BN = require('bn.js')
import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { Proposal } from '../src/proposal'
import { Scheme } from '../src/scheme'
import { firstResult, getTestDAO, newArc } from './utils'

jest.setTimeout(10000)

/**
 * Scheme test
 */
describe('Scheme', () => {

  let arc: Arc

  beforeAll(async () => {
    arc = await newArc()
  })

  it('Scheme is instantiable', () => {
    const scheme = new Scheme(
      '0x1234id', // address
      '0x124daoAddress', // dao address
      'no-name', // name
      '0x123334schemeAddress',
      arc
    )
    expect(scheme).toBeInstanceOf(Scheme)
  })

  it.only('Scheme are searchable', async () => {
    const dao = await getTestDAO()
    let result: Scheme[]
    result = await Scheme.search({dao: dao.address}, arc, { fetchPolicy: 'no-cache' })
        .pipe(first()).toPromise()

    // TODO: we should expect 3 queus here, see https://github.com/daostack/subgraph/issues/195
    expect(result.length).toEqual(3)

    expect((result.map((r) => r.name)).sort()).toEqual([
      'GenericScheme',
      'ContributionReward',
      'SchemeRegistrar'
    ].sort())
    result = await Scheme.search({dao: dao.address, name: 'ContributionReward'}, arc)
        .pipe(first()).toPromise()
    expect(result.length).toEqual(1)

    result = await Scheme.search({dao: dao.address, name: 'GenericScheme'}, arc)
        .pipe(first()).toPromise()
    expect(result.length).toEqual(1)

    result = await Scheme.search({dao: dao.address, name: 'SchemeRegistrar'}, arc)
        .pipe(first()).toPromise()
    expect(result.length).toEqual(1)
  })

  it('Scheme.state() is working', async () => {
    const dao = await getTestDAO()
    const result = await Scheme
      .search({dao: dao.address, name: 'SchemeRegistrar'}, arc)
      .pipe(first()).toPromise()

    const scheme = result[0]
    const state = await scheme.state().pipe(first()).toPromise()
    expect(state).toEqual({
      address: arc.contractAddresses.SchemeRegistrar,
      id: scheme.id,
      name: 'SchemeRegistrar'
    })

  })

  it('Scheme.state() should be equal to proposal.state().scheme', async () => {
    const { queuedProposalId } = DAOstackMigration.migration('private').test
    const proposal = new Proposal(queuedProposalId, '', arc)
    const proposalState = await proposal.state().pipe(first()).toPromise()
    const schemes = await firstResult(Scheme.search({id: proposalState.scheme.id}, arc))
    const schemeState = await firstResult(schemes[0].state())
    expect(proposalState.scheme).toEqual(schemeState)
  })
})
