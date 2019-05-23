import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { Proposal } from '../src/proposal'
import { Queue } from '../src/queue'
import { BN } from './utils'
import { getTestAddresses, getTestDAO, ITestAddresses,  newArc } from './utils'

jest.setTimeout(10000)

/**
 * Queue test
 */
describe('Queue', () => {

    let arc: Arc
    let addresses: ITestAddresses
    let dao: DAO

    beforeAll(async () => {
      arc = await newArc()
      addresses = await getTestAddresses()
      dao = await getTestDAO()
    })

    it('Queue is instantiable', () => {
      const queue = new Queue(
        '0x1234id',
        new DAO('0x124daoAddress', arc),
        'no-name',
        arc
      )
      expect(queue).toBeInstanceOf(Queue)
    })

    it('Queues are searchable', async () => {
      let result: Queue[]
      result = await Queue.search({dao: dao.address}, arc)
          .pipe(first()).toPromise()
      // TODO: we should expect 3 queus here, see https://github.com/daostack/subgraph/issues/195
      expect(result.length).toEqual(2)

      expect((result.map((r) => r.name)).sort()).toEqual([
        'GenericScheme',
        'ContributionReward'
        // SchemeRegistrar is not a queue, because it does not have any proposals yet
        // 'SchemeRegistrar'
      ].sort())
      // TODO: this does not work, cf: https://github.com/daostack/subgraph/issues/196
      // result = await Queue.search({dao: dao.address, name: 'ContributionReward'}, arc, { fetchPolicy: 'no-cache' })
      //     .pipe(first()).toPromise()
      // expect(result.length).toEqual(1)
      result = await Queue.search({dao: dao.address, name: 'GenericScheme'}, arc)
          .pipe(first()).toPromise()

      expect(result.length).toEqual(1)

      result = await Queue.search({dao: dao.address, name: 'SchemeRegistrar'}, arc)
          .pipe(first()).toPromise()

      expect(result.length).toEqual(0)
    })

    it('Queue.state() is working', async () => {
      const result = await Queue.search({dao: dao.address, name: 'GenericScheme'}, arc)
          .pipe(first()).toPromise()

      const queue = result[0]
      const state = await queue.state().pipe(first()).toPromise()
      expect(state).toMatchObject({
        // address: arc.contractAddresses.SchemeRegistrar,
        id: queue.id,
        name: 'GenericScheme'
      })
    })

    it('Queue.state() should be equal to proposal.state().queue', async () => {
      const { queuedProposalId } = addresses.test
      const proposal = await dao.proposal(queuedProposalId)
      const proposalState = await proposal.state().pipe(first()).toPromise()
      const queue = new Queue(proposalState.queue.id, proposalState.queue.dao, '(name)', arc)
      const queueState = await queue.state().pipe(first()).toPromise()
      expect(proposalState.queue).toEqual(queueState)
  })
})
