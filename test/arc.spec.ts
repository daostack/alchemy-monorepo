import Arc from '../src/index'

/**
 * Arc test
 */
describe('Arc ', () => {
  it('Arc is instantiable', () => {
    const arc = new Arc({
      graphqlHttpProvider: 'https://graphql.provider',
      graphqlWsProvider: 'https://graphql.provider',
      web3HttpProvider: 'https://web3.provider',
      web3WsProvider: 'wss://web3.provider'
    })
    expect(arc).toBeInstanceOf(Arc)
  })
})
