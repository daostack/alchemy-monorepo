import Arc from '../src/index'

/**
 * Arc test
 */
describe('Arc ', () => {
  it('Arc is instantiable', () => {
    const arc = new Arc({
      graphqlHttpProvider: 'https://graphql.provider',
      graphqlWSProvider: 'https://graphql.provider',
      web3Provider: 'https://web3.provider'
    })
    expect(arc).toBeInstanceOf(Arc)
  })
})
