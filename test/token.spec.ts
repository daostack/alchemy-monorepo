import BN = require('bn.js')
import { first} from 'rxjs/operators'
import { Arc, IContractAddresses } from '../src/arc'
import { Token } from '../src/token'
import { Address } from '../src/types'
import { fromWei, newArc, getContractAddresses, toWei, waitUntilTrue } from './utils'

jest.setTimeout(10000)
/**
 * Token test
 */
describe('Token', () => {
  let addresses: IContractAddresses
  let arc: Arc
  let address: Address

  beforeAll(async () => {
    arc = newArc()
    addresses = getContractAddresses()
    address = addresses.dao.DAOToken
  })

  it('Token is instantiable', () => {
    const token = new Token(address, arc)
    expect(token).toBeInstanceOf(Token)
    expect(token.address).toBe(address)
  })

  it('get the token state', async () => {
    const token = new Token(address, arc)
    const state = await token.state().pipe(first()).toPromise()
    expect(Object.keys(state)).toEqual(['address', 'name', 'owner', 'symbol', 'totalSupply'])
    const expected = {
       address: address.toLowerCase()
    }
    expect(state).toMatchObject(expected)
  })

  it('throws a reasonable error if the contract does not exist', async () => {
    expect.assertions(1)
    const token = new Token('0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1', arc)
    await expect(token.state().toPromise()).rejects.toThrow(
      'Could not find a token contract with address 0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1'
    )
  })

  it('throws a reasonable error if the constructor gets an invalid address', async () => {
    await expect(() => new Token('0xinvalid', arc)).toThrow(
      'Not a valid address: 0xinvalid'
    )
  })

  it('get someones balance', async () => {
    const token = new Token(address, arc)
    const balanceOf = await token.balanceOf('0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1')
      .pipe(first()).toPromise()
    expect(fromWei(balanceOf)).toEqual('1000')
  })

  it('mint some new tokens', async () => {
    const token = new Token(addresses.organs.DemoDAOToken, arc)
    const account = '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1'
    // check if the currentAccount is the owner of the contract
    const balances: BN[] = []
    const amount = new BN('1234')
    token.balanceOf(account).subscribe((next: BN) => balances.push(next))
    await token.mint(account, amount).send()
    await waitUntilTrue(() => balances.length > 1)
    expect(balances[1].sub(balances[0]).toString()).toEqual(amount.toString())
  })

  it('balanceOf GEN token also works', async () => {
    const token = arc.GENToken()
    const account = '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1'
    const balances: BN[] = []
    const amount = new BN('1234')
    token.balanceOf(account).subscribe((next: BN) => balances.push(next))
    await token.mint(account, amount).send()
    await waitUntilTrue(() => balances.length > 1)
    expect(balances[1].sub(balances[0]).toString()).toEqual(amount.toString())
  })

  it('see approvals', async () => {
    const token = new Token(address, arc)
    const approvals = await token.approvals('0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1')
      .pipe(first()).toPromise()
    expect(approvals).toEqual([])
    // todo: this needs a test with some approvals

  })

  it('approveForStaking works and is indexed property', async () => {
    const token = new Token(arc.getContract('GEN').options.address, arc)
    const amount = toWei('31415')
    await token.approveForStaking(amount).send()
    let allowances: any[] = []

    token.allowances({ owner: arc.web3.eth.defaultAccount}).subscribe(
      (next: any) => allowances = next
    )
    await waitUntilTrue(() => allowances.length > 0 && allowances[0].amount.gte(amount))
    expect(allowances[0]).toMatchObject({
      amount,
      owner: arc.web3.eth.defaultAccount.toLowerCase(),
      spender: arc.getContract('GenesisProtocol').options.address.toLowerCase()
    })
  })
})
