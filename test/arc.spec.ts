import Arc from '../src/index'
import { getArc } from './utils'

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

  it('arc.getContract() works', async () => {
    const arc = await getArc()
    expect(arc.getContract('ContributionReward')).toBeInstanceOf(arc.web3.eth.Contract)
    expect(arc.getContract('AbsoluteVote')).toBeInstanceOf(arc.web3.eth.Contract)
  })
})
