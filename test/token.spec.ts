import { Token } from '../src/token'

/**
 * Token test
 */
describe('Token', () => {
  it('Token is instantiable', () => {
    const address = '0xa2A064b3B22fC892dfB71923a6D844b953AA247C'
    const token = new Token(address)
    expect(token).toBeInstanceOf(Token)
  })
})
