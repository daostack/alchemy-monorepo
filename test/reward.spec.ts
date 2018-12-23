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
})
