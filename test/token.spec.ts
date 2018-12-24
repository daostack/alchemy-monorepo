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
    const token = new Token(address, arc)
    const state = await token.state.pipe(first()).toPromise()
    expect(Object.keys(state)).toEqual(['address', 'name', 'owner', 'symbol', 'totalSupply'])
    const expected = {
       address: address.toLowerCase()
    }
    expect(state).toMatchObject(expected)
  })

  it('throws a reasonable error if the contract does not exist', async () => {
    expect.assertions(1)
    const token = new Token('0xFake', arc)
    await expect(token.state.toPromise()).rejects.toThrow(
      'Could not find a token contract with address 0xfake'
    )
  })

  it('get someones balance', async () => {
    const token = new Token(address, arc)
    const balanceOf = await token.balanceOf('0xb0c908140fe6fd6fbd4990a5c2e35ca6dc12bfb2')
      .pipe(first()).toPromise()
    expect(balanceOf).toEqual(1000)
  })

  it('see approvals', async () => {
    const token = new Token(address, arc)
    const approvals = await token.approvals('0xb0c908140fe6fd6fbd4990a5c2e35ca6dc12bfb2')
      .pipe(first()).toPromise()
    expect(approvals).toEqual([])
    // todo: this needs a test with some approvals

  })
})
