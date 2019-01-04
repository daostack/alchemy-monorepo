import { first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { Token } from '../src/token'
import { Address } from '../src/types'
import { getArc, getContractAddresses, getWeb3 } from './utils'
/**
 * Token test
 */
describe('Token', () => {
  let addresses: { [key: string]: Address }
  let arc: Arc
  let address: Address
  let web3: any

  beforeAll(async () => {
    arc = getArc()
    addresses = getContractAddresses()
    address = addresses.NativeToken
    web3 = await getWeb3()
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
    const balanceOf = await token.balanceOf('0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1')
      .pipe(first()).toPromise()
    expect(balanceOf).toEqual(1e21)
  })

  it('see approvals', async () => {
    const token = new Token(address, arc)
    const approvals = await token.approvals('0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1')
      .pipe(first()).toPromise()
    expect(approvals).toEqual([])
    // todo: this needs a test with some approvals

  })
})
