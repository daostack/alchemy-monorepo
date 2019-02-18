const BN = require('bn.js')
import { first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { Reputation } from '../src/reputation'
import { Address } from '../src/types'
import { fromWei, getArc, getContractAddresses, toWei } from './utils'
/**
 * Reputation test
 */
describe('Reputation', () => {

  let addresses: any
  let arc: Arc
  let address: Address
  let accounts: any

  beforeAll(async () => {
    addresses = getContractAddresses()
    address = addresses.dao.Reputation
    arc = getArc()
    accounts = arc.web3.eth.accounts.wallet
  })

  it('Reputation is instantiable', () => {
    const reputation = new Reputation(address, arc)
    expect(reputation).toBeInstanceOf(Reputation)
    expect(reputation.address).toBe(address)
  })

  it('get the reputation state', async () => {
    const reputation = new Reputation(address, arc)
    expect(reputation).toBeInstanceOf(Reputation)
    const state = await reputation.state.pipe(first()).toPromise()
    expect(Object.keys(state)).toEqual(['address', 'totalSupply'])
    const expected = {
       address: address.toLowerCase()
    }
    expect(state).toMatchObject(expected)
  })

  it('throws a reasonable error if the contract does not exist', async () => {
    expect.assertions(1)
    const reputation = new Reputation('0xe74f3c49c162c00ac18b022856e1a4ecc8947c42', arc)
    await expect(reputation.state.toPromise()).rejects.toThrow(
      'Could not find a reputation contract with address 0xe74f3c49c162c00ac18b022856e1a4ecc8947c42'
    )
  })

  it('get someones reputation', async () => {
    const reputation = new Reputation(address, arc)
    const reputationOf = await reputation.reputationOf(accounts[2].address)
      .pipe(first()).toPromise()
    expect(fromWei(reputationOf)).toEqual('1000')
  })

  it.only('mint() works', async () => {
    const reputation = new Reputation(addresses.organs.DemoReputation, arc)
    const reputationBefore = new BN(await reputation.contract().methods.balanceOf(accounts[3].address).call())
    await reputation.mint(accounts[3].address, toWei(1)).send()
    await reputation.mint(accounts[3].address, new BN('1')).send()
    await reputation.mint(accounts[3].address, new BN('1e18')).send()
    await reputation.mint(accounts[3].address, new BN('3000e18')).send()

    const reputationAfter = new BN(await reputation.contract().methods.balanceOf(accounts[3].address).call())
    const difference = reputationAfter.sub(reputationBefore)
    expect(difference.toString()).toEqual('100000000003003837')

  })
  it.skip('reputationOf throws a meaningful error if an invalid address is provided', async () => {
    // write this test
  })
})
