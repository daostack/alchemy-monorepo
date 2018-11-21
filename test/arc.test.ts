import Arc from '../src/index'

/**
 * Arc test
 */
describe('Arc ', () => {
  it('Arc is instantiable', () => {
    const arc = new Arc({
      graphqlProvider: 'https://graphql.provider',
      web3Provider: 'https://web3.provider'
    })
    expect(arc).toBeInstanceOf(Arc)
  })
})
