const DAOstackMigration = require('@daostack/migration')
import BN = require('bn.js')
import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { Proposal } from '../src/proposal'
import { Queue } from '../src/queue'
import { getTestDAO, newArc } from './utils'

jest.setTimeout(10000)

/**
 * Queue test
 */
describe('Queue', () => {

  let arc: Arc

  beforeAll(async () => {
    arc = await newArc()
  })

  it('Queue is instantiable', () => {
    const queue = new Queue(
      '0x1234id',
      '0x124daoAddress',
      'no-name',
      arc
    )
    expect(queue).toBeInstanceOf(Queue)
  })

  it('Queues are searchable', async () => {
    const dao = await getTestDAO()
    let result: Queue[]
    result = await Queue.search({dao: dao.address}, arc, { fetchPolicy: 'no-cache' })
        .pipe(first()).toPromise()
    // TODO: we should expect 3 queus here, see https://github.com/daostack/subgraph/issues/195
    expect(result.length).toEqual(3)

    expect((result.map((r) => r.name)).sort()).toEqual([
      'GenericScheme',
      'ContributionReward',
      'SchemeRegistrar'
    ].sort())
    // TODO: this does not work, cf: https://github.com/daostack/subgraph/issues/196
    // result = await Queue.search({dao: dao.address, name: 'ContributionReward'}, arc, { fetchPolicy: 'no-cache' })
    //     .pipe(first()).toPromise()
    // expect(result.length).toEqual(1)
  })

  it('Queue.state() is working', async () => {
    const dao = await getTestDAO()
    const result = await Queue.search({dao: dao.address}, arc, { fetchPolicy: 'no-cache' })
        .pipe(first()).toPromise()

    const queue = result[0]
    const state = await queue.state().pipe(first()).toPromise()
    expect(state).toMatchObject({
      id: queue.id
    })
    expect(state.proposingRepReward.toString()).toEqual(new BN(5000000000).toString())

  })

  it('Queue.state() should be equal to proposal.state().queue', async () => {
    const { queuedProposalId } = DAOstackMigration.migration('private').test

    const proposal = new Proposal(queuedProposalId, '', arc)
    const proposalState = await proposal.state().pipe(first()).toPromise()
    const queue = new Queue(proposalState.queue.id, proposalState.queue.dao, '', arc)
    const queueState = await queue.state().pipe(first()).toPromise()
    expect(proposalState.queue).toEqual(queueState)
  })
})
