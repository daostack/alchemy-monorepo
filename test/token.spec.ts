import { first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { Token } from '../src/token'
import { Address } from '../src/types'
import { getArc, getContractAddresses } from './utils'
/**
 * Token test
 */
describe('Token', () => {
  let addresses: { [key: string]: Address }
  let arc: Arc
  let address: Address

  beforeAll(() => {
    arc = getArc()
    addresses = getContractAddresses()
    address = addresses.NativeToken
  })

  it('Token is instantiable', () => {
    const token = new Token(address, arc)
    expect(token).toBeInstanceOf(Token)
    expect(token.address).toBe(address)
  })

  it('get the token state', async () => {
    const reputation = new Token(address, arc)
    const state = await reputation.state.pipe(first()).toPromise()
    expect(Object.keys(state)).toEqual(['address', 'name', 'owner', 'symbol', 'totalSupply'])
    const expected = {
       address: address.toLowerCase()
    }
    expect(state).toMatchObject(expected)
  })

  it('throws a reasonable error if the contract does not exist', async () => {
    expect.assertions(1)
    const reputation = new Token('0xFake', arc)
    await expect(reputation.state.toPromise()).rejects.toThrow(
      'Could not find a token contract with address 0xfake'
    )
  })
})
