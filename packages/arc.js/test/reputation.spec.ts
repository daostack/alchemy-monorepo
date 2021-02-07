import BN = require('bn.js')
import { first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { Reputation } from '../src/reputation'
import { Address } from '../src/types'
import { getTestAddresses, newArc, toWei, waitUntilTrue } from './utils'

/**
 * Reputation test
 */
describe('Reputation', () => {

  let addresses: any
  let arc: Arc
  let address: Address
  let accounts: any

  beforeAll(async () => {
    arc = await newArc()
    addresses = getTestAddresses(arc)
    address = addresses.dao.Reputation
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
    const state = await reputation.state().pipe(first()).toPromise()
    expect(Object.keys(state)).toEqual(['address', 'dao', 'totalSupply'])
    const expected = {
       address: address.toLowerCase()
    }
    expect(state).toMatchObject(expected)
  })

  it('throws a reasonable error if the contract does not exist', async () => {
    expect.assertions(1)
    const reputation = new Reputation('0xe74f3c49c162c00ac18b022856e1a4ecc8947c42', arc)
    await expect(reputation.state().toPromise()).rejects.toThrow(
      'Could not find a reputation contract with address 0xe74f3c49c162c00ac18b022856e1a4ecc8947c42'
    )
  })

  it('get someones reputation', async () => {
    const reputation = new Reputation(address, arc)
    const reputationOf = await reputation.reputationOf(accounts[2].address)
      .pipe(first()).toPromise()
    expect(Number(reputationOf.toString())).toBeGreaterThan(0)
  })

  it('mint() works', async () => {
    const reputation = new Reputation(addresses.test.organs.DemoReputation, arc)
    const reputationBefore = new BN(await reputation.contract().methods.balanceOf(accounts[3].address).call())
    await reputation.mint(accounts[3].address, toWei(1)).send()
    await reputation.mint(accounts[3].address, new BN('1')).send()
    await reputation.mint(accounts[3].address, new BN('1e18')).send()
    await reputation.mint(accounts[3].address, new BN('3000e18')).send()

    const reputationAfter = new BN(await reputation.contract().methods.balanceOf(accounts[3].address).call())
    const difference = reputationAfter.sub(reputationBefore)
    expect(difference.toString()).toEqual('1000000000003003837')
  })

  it('mint() throws a meaningful error if the sender is not the contract owner', async () => {
    const reputation = new Reputation(addresses.test.Reputation, arc)
    await expect(reputation.mint(accounts[3].address, toWei(1)).send()).rejects.toThrow(
      /is not the owner/i
    )
  })

  it('reputationOf throws a meaningful error if an invalid address is provided', async () => {
    const reputation = new Reputation(addresses.test.Reputation, arc)
    await expect(() => reputation.reputationOf('0xInvalidAddress')).toThrow(
      /not a valid address/i
    )
  })

  it('Reputations are searchable', async () => {
    let reputations: Reputation[] = []

    Reputation.search(arc)
      .subscribe((result) => reputations = result)

    await waitUntilTrue(() => reputations.length !== 0)

    expect(reputations.length).toBeGreaterThanOrEqual(2)

    const expectedAddresses = [
      address,
      addresses.test.Reputation
    ]

    expectedAddresses.forEach((expectedAddress) => {
      expect(
        reputations.findIndex((reputation) =>
          reputation.address.toLowerCase() === expectedAddress.toLowerCase()
        )
      ).toBeGreaterThan(-1)
    })
  })

  it('paging and sorting works', async () => {
    const ls1 = await Reputation.search(arc, { first: 3, orderBy: 'id' }).pipe(first()).toPromise()
    expect(ls1.length).toEqual(3)
    expect(ls1[0].id <= ls1[1].id).toBeTruthy()

    const ls2 = await Reputation.search(arc, { first: 2, skip: 2, orderBy: 'id' }).pipe(first()).toPromise()
    expect(ls2.length).toEqual(2)
    expect(ls1[2].id).toEqual(ls2[0].id)

    const ls3 = await Reputation.search(arc, {  orderBy: 'id', orderDirection: 'desc'}).pipe(first()).toPromise()
    expect(ls3[0].id >= ls3[1].id).toBeTruthy()
  })
})
