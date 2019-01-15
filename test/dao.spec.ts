import { first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { getArc, getContractAddresses, getContractAddressesFromSubgraph,
  getOptions, getWeb3, nullAddress } from './utils'

/**
 * DAO test
 */
describe('DAO', () => {
  let addresses: { [key: string]: string }
  let arc: Arc
  let web3: any
  let accounts: any

  async function _getSomeDAOAddress() {
    addresses = getContractAddresses()
    const result = await getContractAddressesFromSubgraph()
    return result.daos[0].address
    // return result.daos[0].address
  }

  beforeAll(async () => {
    addresses = getContractAddresses()
    arc = getArc()
    web3 = await getWeb3()
    accounts = web3.eth.accounts.wallet
    web3.eth.defaultAccount = accounts[0].address
})

  it('DAO is instantiable', () => {
    const address = '0x12345'
    const dao = new DAO(address, arc)
    expect(dao).toBeInstanceOf(DAO)
  })

  it('should be possible to get the token balance of the DAO', async () => {
    // const address = addresses.Avatar
    const address = await _getSomeDAOAddress()
    const dao = new DAO(address, arc)
    const { token } = await dao.state.pipe(first()).toPromise()
    const balance = await token.balanceOf(dao.address).pipe(first()).toPromise()
    expect(balance).toEqual(0)
  })

  it('should be possible to get the reputation balance of the DAO', () => {
    // const { reputation } = await dao.state.toPromise()
    // const balance = await reputation.balanceOf(address).toPromise()
  })

  it('get the list of daos', async () => {
    const daos = arc.daos()
    const daoList = await daos.pipe(first()).toPromise()
    expect(typeof daoList).toBe('object')
    expect(daoList.length).toBeGreaterThan(0)
    // expect(daoList[daoList.length - 2].address).toBe(addresses.Avatar.toLowerCase())
  })

  it('get the dao state', async () => {
    // const dao = arc.dao(addresses.Avatar.toLowerCase())
    const address = await _getSomeDAOAddress()
    const dao = arc.dao(address)
    expect(dao).toBeInstanceOf(DAO)
    const state = await dao.state.pipe(first()).toPromise()
    const expected = {
       // address: addresses.Avatar.toLowerCase(),
       address,
       memberCount: 6,
       name: 'Genesis Test'
    }
    expect(state).toMatchObject(expected)
    expect(Object.keys(state)).toEqual([
      'address',
      'ethBalance',
      'externalTokenAddress',
      'externalTokenBalance',
      'externalTokenSymbol',
      'memberCount',
      'name',
      'reputation',
      'reputationTotalSupply',
      'token',
      'tokenBalance',
      'tokenName',
      'tokenSymbol',
      'tokenTotalSupply'
    ])
  })

  it('throws a reasonable error if the contract does not exist', async () => {
    expect.assertions(1)
    const reputation = new DAO('0xfake', arc)
    await expect(reputation.state.toPromise()).rejects.toThrow(
      'Could not find a DAO with address 0xfake'
    )
  })

  it.skip('dao.members() should work', async () => {
    // TODO: because we have not setup with proposals, we are only testing if the current state returns the emty list
    const address = await _getSomeDAOAddress()
    const dao = arc.dao(address)
    // const dao = arc.dao(addresses.Avatar.toLowerCase())
    const members = await dao.members().pipe(first()).toPromise()
    expect(typeof members).toEqual(typeof [])
    expect(members.length).toBeGreaterThan(0)
    const member = members[0]
  })

  it('dao.ethBalance() should work', async () => {
    const dao = arc.dao(addresses.Avatar.toLowerCase())
    const balanceObservable = dao.ethBalance()
    const previousBalance = await balanceObservable.pipe(first()).toPromise()
    // expect(balance).toBe(web3.utils.toWei('0'))
    await web3.eth.sendTransaction({
      from: web3.eth.defaultAccount,
      gas: 4000000,
      gasPrice: 100000000000,
      to: addresses.Avatar.toLowerCase(),
      value: web3.utils.toWei('1', 'ether')
    })
    const newBalance = await balanceObservable.pipe(first()).toPromise()

    expect(newBalance - previousBalance).toBe(web3.utils.toWei('1'))
  })

})
