import { first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { ProposalOutcome} from '../src/proposal'
import { Stake } from '../src/stake'
import { getArc, toWei } from './utils'

/**
 * Stake test
 */
describe('Stake', () => {

  let arc: Arc

  beforeAll(() => {
    arc = getArc()
  })

  it('Stake is instantiable', () => {
    const stake = new Stake('0x1234id', '0x124staker', new Date(), ProposalOutcome.Fail, toWei("300"), '0x12445proposalId')
    expect(stake).toBeInstanceOf(Stake)
  })

  it('Stakes are searchable', async () => {
    let result

    result = await Stake.search(arc, {proposal: '0x12345'})
      .pipe(first()).toPromise()
    expect(result).toEqual([])
  })
})
