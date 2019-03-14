import BN = require('bn.js')
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
      ipfsProvider: {
        host: 'localhost',
        port: '5001',
        protocol: 'https'
      },
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

  it('arc.ethBalance() works', async () => {
    const arc = await getArc()
    // observe two balances
    const balances1: BN[] = []
    const balances2: BN[] = []
    const address1 = arc.web3.eth.accounts.wallet[1].address
    const address2 = arc.web3.eth.accounts.wallet[2].address

    const subscription1 = arc.ethBalance(address1).subscribe((balance) => {
      balances1.push(balance)
    })
    const subscription2 = arc.ethBalance(address2).subscribe((balance) => {
      balances2.push(balance)
    })

    // send some ether to the test accounts
    const amount1 = new BN('123456')
    await arc.web3.eth.sendTransaction({
      gas: 4000000,
      gasPrice: 100000000000,
      to: address1,
      value: amount1
    })
    const amount2 = new BN('456677')
    await arc.web3.eth.sendTransaction({
      gas: 4000000,
      gasPrice: 100000000000,
      to: address2,
      value: amount2
    })

    await waitUntilTrue(() => balances1.length > 1)
    await waitUntilTrue(() => balances2.length > 1)

    expect(balances1.length).toEqual(2)
    expect(balances2.length).toEqual(2)
    expect(balances1[1].sub(balances1[0]).toString()).toEqual(amount1.toString())
    expect(balances2[1].sub(balances2[0]).toString()).toEqual(amount2.toString())
    await subscription2.unsubscribe()
    // expect(Object.keys(arc.observedAccounts)).toEqual([address1])
    await subscription1.unsubscribe()
    expect(Object.keys(arc.observedAccounts)).toEqual([])
    expect(arc.blockHeaderSubscription).toEqual(undefined)

  })
})
