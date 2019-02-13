import Arc from '../src/index'
import { Logger } from '../src/logger'
import { getArc, waitUntilTrue } from './utils'

Logger.setLevel(Logger.OFF)
/**
 * Arc test
 */
describe('Arc ', () => {
  it('Arc is instantiable', () => {
    const arc = new Arc({
      graphqlHttpProvider: 'https://graphql.provider',
      graphqlWsProvider: 'https://graphql.provider',
      web3Provider: 'wss://web3.provider'
    })
    expect(arc).toBeInstanceOf(Arc)
  })

  it('arc.getContract() works', async () => {
    const arc = await getArc()
    expect(arc.getContract('ContributionReward')).toBeInstanceOf(arc.web3.eth.Contract)
    expect(arc.getContract('AbsoluteVote')).toBeInstanceOf(arc.web3.eth.Contract)
  })

  it('arc.allowance() should work', async () => {
    const arc = await getArc()
    let approval: any
    arc.allowance(arc.web3.eth.defaultAccount).subscribe(
      (next: any) => {
        approval = next
      }
    )
    await arc.approveForStaking(1001).send()
    await waitUntilTrue(() => {
      if (approval) {
        return approval.amount === 1001
      } else {
        return false
      }
    })
    expect(approval.amount).toEqual(1001)
  })
})
