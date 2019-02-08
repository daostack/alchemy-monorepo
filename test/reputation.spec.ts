import { first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { Reputation } from '../src/reputation'
import { Address } from '../src/types'
import { getArc, getContractAddresses, getWeb3 } from './utils'
/**
 * Reputation test
 */
describe('Reputation', () => {

  let addresses: any
  let arc: Arc
  let address: Address
  let web3: any
  let accounts: any

  beforeAll(async () => {
    addresses = getContractAddresses()
    address = addresses.dao.Reputation
    arc = getArc()
    web3 = await getWeb3()
    accounts = web3.eth.accounts.wallet
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
    expect(Object.keys(state)).toEqual(['address', 'name', 'symbol', 'totalSupply'])
    const expected = {
       address: address.toLowerCase(),
       symbol: 'REP'
    }
    expect(state).toMatchObject(expected)
  })

  it('throws a reasonable error if the contract does not exist', async () => {
    expect.assertions(1)
    const reputation = new Reputation('0xFake', arc)
    await expect(reputation.state.toPromise()).rejects.toThrow(
      'Could not find a reputation contract with address 0xfake'
    )
  })

  it('get someones reputation', async () => {
    const reputation = new Reputation(address, arc)
    const reputationOf = await reputation.reputationOf(accounts[2].address)
      .pipe(first()).toPromise()
    expect(reputationOf).toEqual(1e21)
  })

  it.skip('reputationOf throws a meaningful error if an invalid address is provided', async () => {
    // write this test
  })
})
