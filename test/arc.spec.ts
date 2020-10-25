import BN = require('bn.js')
import gql from 'graphql-tag'
import { first } from 'rxjs/operators'
import Arc from '../src/index'
import { Proposal } from '../src/proposal'
import { Scheme } from '../src/scheme'
import { REDEEMER_CONTRACT_VERSIONS } from '../src/settings'
import { Address } from '../src/types'
import {
  fromWei,
  getTestAddresses,
  newArc,
  newArcWithoutEthereum,
  newArcWithoutGraphql,
  toWei,
  waitUntilTrue,
  web3Provider
} from './utils'

jest.setTimeout(20000)

/**
 * Arc test
 */
describe('Arc ', () => {
  it('Arc is instantiable', () => {
    const arc = new Arc({
      contractInfos: [],
      graphqlHttpProvider: 'https://graphql.provider',
      graphqlWsProvider: 'https://graphql.provider',
      ipfsProvider: 'http://localhost:5001/api/v0',
      web3Provider: 'wss://web3.provider'
    })
    expect(arc).toBeInstanceOf(Arc)
  })

  it('Arc is usable without subgraph connection', async () => {
    const arc = await newArcWithoutGraphql()
    expect(arc).toBeInstanceOf(Arc)

    expect(() => arc.sendQuery(gql`{daos {id}}`)).toThrowError(/no connection/i)
  })

  it('Arc is usable without knowing about contracts', async () => {
    const arc = await newArcWithoutEthereum()
    expect(arc).toBeInstanceOf(Arc)

    const daos = arc.sendQuery(gql`{daos {id}}`)
    expect(daos).toBeTruthy()
  })

  it('arc.allowances() should work', async () => {
    const arc = await newArc()

    const allowances: BN[] = []
    const spender = '0xDb56f2e9369E0D7bD191099125a3f6C370F8ed15'
    const amount = toWei(1001)
    await arc.approveForStaking(spender, amount).send()
    arc.allowance(arc.web3.eth.defaultAccount, spender).subscribe(
      (next: BN) => {
        allowances.push(next)
      }
    )
    const lastAllowance = () => allowances[allowances.length - 1]
    await waitUntilTrue(() => (allowances.length > 0))
    expect(fromWei(lastAllowance())).toEqual('1001')
  })

  it('arc.allowance() should work', async () => {
    const arc = await newArc()

    const allowances: BN[] = []
    const spender = '0xDb56f2e9369E0D7bD191099125a3f6C370F8ed15'
    const amount = toWei(1001)
    await arc.approveForStaking(spender, amount).send()
    arc.allowance(arc.web3.eth.defaultAccount, spender).subscribe(
      (next: BN) => {
        allowances.push(next)
      }
    )
    const lastAllowance = () => allowances[allowances.length - 1]
    await waitUntilTrue(() => (allowances.length > 0))
    expect(fromWei(lastAllowance())).toEqual('1001')
  })

  it('arc.getAccount() works and is correct', async () => {
    const arc = await newArc()
    const addressesObserved: Address[] = []
    arc.getAccount().subscribe((address) => addressesObserved.push(address))
    await waitUntilTrue(() => addressesObserved.length > 0)
    expect(addressesObserved[0]).toEqual(arc.web3.eth.defaultAccount)
  })

  it('arc.ethBalance() works with an account with 0 balance', async () => {
    const arc = await newArc()
    const balance = await arc.ethBalance('0x90f8bf6a479f320ead074411a4b0e7944ea81111').pipe(first()).toPromise()
    expect(balance).toEqual(new BN(0))

  })

  it('arc.ethBalance() works with multiple subscriptions', async () => {
    const arc = await newArc()
    // observe two balances
    const balances1: BN[] = []
    const balances2: BN[] = []
    const balances3: BN[] = []
    const address1 = arc.web3.eth.accounts.wallet[1].address
    const address2 = arc.web3.eth.accounts.wallet[2].address

    const subscription1 = arc.ethBalance(address1).subscribe((balance) => {
      balances1.push(balance)
    })
    const subscription2 = arc.ethBalance(address2).subscribe((balance) => {
      balances2.push(balance)
    })
    //
    // send some ether to the test accounts
    async function sendEth(address: Address, amount: BN) {
      await arc.web3.eth.sendTransaction({
        gas: 4000000,
        gasPrice: 100000000000,
        to: address,
        value: amount
      })

    }
    const amount1 = new BN('123456')
    const amount2 = new BN('456677')
    await sendEth(address1, amount1)
    await sendEth(address2, amount2)

    await waitUntilTrue(() => balances1.length > 1)
    await waitUntilTrue(() => balances2.length > 1)

    expect(balances1.length).toEqual(2)
    expect(balances2.length).toEqual(2)
    expect(balances1[1].sub(balances1[0]).toString()).toEqual(amount1.toString())
    expect(balances2[1].sub(balances2[0]).toString()).toEqual(amount2.toString())

    // add a second subscription for address2's balance
    const subscription3 = arc.ethBalance(address2).subscribe((balance) => {
      balances3.push(balance)
    })

    await waitUntilTrue(() => balances3.length >= 1)
    expect(balances3[balances3.length - 1].toString()).toEqual(balances2[balances2.length - 1].toString())
    await subscription2.unsubscribe()
    // expect(Object.keys(arc.observedAccounts)).toEqual([address1])
    await subscription1.unsubscribe()

    // we have unsubscribed from subscription2, but we are still observing the account with subscription3
    expect(Object.keys(arc.observedAccounts).length).toEqual(1)

    const amount3 = new BN('333333')
    expect(balances3.length).toEqual(1)
    await sendEth(address2, amount3)
    await waitUntilTrue(() => balances3.length >= 2)
    expect(balances3[balances3.length - 1]).toEqual(balances3[balances3.length - 2].add(amount3))

    await subscription3.unsubscribe()
    // check if we cleanup up completely
    expect(Object.keys(arc.observedAccounts).length).toEqual(0)
    expect(arc.blockHeaderSubscription).toEqual(undefined)

  })

  it('arc.proposal() should work', async () => {
    const arc = await newArc()
    const proposal = arc.proposal(getTestAddresses(arc).test.executedProposalId)
    expect(proposal).toBeInstanceOf(Proposal)
  })

  it('arc.proposals() should work', async () => {
    const arc = await newArc()
    const proposals = await arc.proposals().pipe(first()).toPromise()
    expect(typeof proposals).toEqual(typeof [])
    expect(proposals.length).toBeGreaterThanOrEqual(6)
  })

  it('separates reading and sending transactions correctly', async () => {
    // these tests are a bit clumsy, because we have access to only a single node

    // we now expect all read operations to fail, and all write operations to succeed
    const arcWrite = await newArc({ web3ProviderRead: 'http://does.not.exist' })

    expect(arcWrite.ethBalance('0x90f8bf6a479f320ead074411a4b0e7944ea81111').pipe(first()).toPromise())
      .rejects.toThrow()
    expect(arcWrite.GENToken().balanceOf('0x90f8bf6a479f320ead074411a4b0e7944ea81111').pipe(first()).toPromise())
      .rejects.toThrow()
    expect(arcWrite.GENToken()
      .allowance('0x90f8bf6a479f320ead074411a4b0e7944ea81111', '0x90f8bf6a479f320ead074411a4b0e7944ea81111')
      .pipe(first()).toPromise())
      .rejects.toThrow()
    // we now expect all write operations to fail, and all read operations to succeed
    const arcRead = await newArc({ web3Provider: 'http://doesnotexist.com', web3ProviderRead: web3Provider })
    expect(await arcRead.ethBalance('0x90f8bf6a479f320ead074411a4b0e7944ea81111').pipe(first()).toPromise())
      .toEqual(new BN(0))
  })
  it('arc.scheme() should work', async () => {
    const arc = await newArc()
    const schemeId = '0x124355'
    const scheme = arc.scheme(schemeId)
    expect(scheme).toBeInstanceOf(Scheme)
  })

  it('arc.schemes() should work', async () => {
    const arc = await newArc()
    const schemes = await arc.schemes().pipe(first()).toPromise()
    expect(schemes.length).toBeGreaterThan(0)
  })

  it('arc.fetchContractInfos() should return lower case addresses', async () => {
    const arc = await newArc()
    await arc.fetchContractInfos()
    const anAddress = arc.contractInfos[2].address
    expect(anAddress).toEqual(anAddress.toLowerCase())
  })

  it('arc.getABI works', async () => {
    const arc = await newArc()
    await arc.fetchContractInfos()
    const abi = arc.getABI(undefined, 'Redeemer', REDEEMER_CONTRACT_VERSIONS[0])
    expect(abi[0].name).toEqual('redeem')
  })

  it('scheme contractInfo should contain alias', async () => {
    const arc = await newArc()
    const schemeId = '0x248b2b6dddc29d88fec5a8c18153f4ccce3ca2fb'

    const contractInfo = arc.getContractInfo(schemeId)

    expect(contractInfo.alias).toEqual("ContributionRewardExt")
  })
})
