import { Reward } from '../src/reward'

/**
 * Reward test
 */
describe('Reward', () => {
  it('Reward is instantiable', () => {
    const id = 'some-id'
    const reward = new Reward(id)
    expect(reward).toBeInstanceOf(Reward)
  })
})
