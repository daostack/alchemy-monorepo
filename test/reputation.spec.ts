import gql from 'graphql-tag'
import { concat, first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { Reputation } from '../src/reputation'
import { Address } from '../src/types'
import { getArc, getContractAddresses } from './utils'
/**
 * Reputation test
 */
describe('Reputation', () => {

  let addresses: { [key: string]: string }
  let arc: Arc
  let address: Address

  beforeAll(() => {
    addresses = getContractAddresses()
    address = addresses.NativeReputation
    arc = getArc()
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
    const reputationOf = await reputation.reputationOf('0xb0c908140fe6fd6fbd4990a5c2e35ca6dc12bfb2')
      .pipe(first()).toPromise()
    expect(reputationOf).toEqual(1000)
  })

})
