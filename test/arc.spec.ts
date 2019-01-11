import Arc from '../src/index'

/**
 * Arc test
 */
describe('Arc ', () => {
  it('Arc is instantiable', () => {
    const arc = new Arc({
      graphqlHttpProvider: 'https://graphql.provider',
      graphqlWsProvider: 'https://graphql.provider',
      web3Provider: 'https://web3.provider',
      contractAddresses: {}
    })
    expect(arc).toBeInstanceOf(Arc)
  })
})
