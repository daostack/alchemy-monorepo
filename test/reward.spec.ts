import { first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { Reward } from '../src/reward'
import { getArc } from './utils'

/**
 * Reward test
 */
describe('Reward', () => {

  let arc: Arc

  beforeAll(() => {
    arc = getArc()
  })

  it('Reward is instantiable', () => {
    const id = 'some-id'
    const reward = new Reward(id, arc)
    expect(reward).toBeInstanceOf(Reward)
  })
  it('Rewards are searchable', async () => {
    let result

    result = await Reward.search(arc, {})
      .pipe(first()).toPromise()
    expect(result).toEqual([])

    result = await Reward.search(arc, {proposal: '0x12345'})
      .pipe(first()).toPromise()
    expect(result).toEqual([])
  })
})
