import Arc from '../src/index'
import { Logger } from '../src/logger'
import { Address } from '../src/types'
import { fromWei, getArc, toWei, waitUntilTrue } from './utils'

Logger.setLevel(Logger.OFF)
jest.setTimeout(10000)

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
    await arc.approveForStaking(toWei('1001')).send()
    await waitUntilTrue(() => {
      if (approval) {
        return fromWei(approval.amount) === '1001'
      } else {
        return false
      }
    })
    expect(fromWei(approval.amount)).toEqual('1001')
  })

  it('arc.getAccount() works and is correct', async () => {
    const arc = await getArc()
    const addressesObserved: Address[] = []
    arc.getAccount().subscribe((address) => addressesObserved.push(address))
    await waitUntilTrue(() => addressesObserved.length > 0)
    expect(addressesObserved[0]).toEqual(arc.web3.eth.defaultAccount)
  })
})
