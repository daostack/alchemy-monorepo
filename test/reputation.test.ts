import { Reputation } from '../src/reputation'

/**
 * Reputation test
 */
describe('Reputation', () => {
  it('Reputation is instantiable', () => {
    const address = '0xa2A064b3B22fC892dfB71923a6D844b953AA247C'
    const reputation = new Reputation(address)
    expect(reputation).toBeInstanceOf(Reputation)
  })
})
