import BN = require('bn.js')
import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { fromWei, getTestDAO, newArc, toWei } from './utils'

/**
 * DAO test
 */
describe('DAO', () => {
  let arc: Arc

  beforeAll(async () => {
    arc = newArc()
})

  it('DAO is instantiable', () => {
    const address = '0x12345'
    const dao = new DAO(address, arc)
    expect(dao).toBeInstanceOf(DAO)
  })

  it('should be possible to get the token balance of the DAO', async () => {
    const dao = await getTestDAO()
    const { token } = await dao.state().pipe(first()).toPromise()
    const balance = await token.balanceOf(dao.address).pipe(first()).toPromise()
    expect(fromWei(balance)).toEqual('0')
  })

  it('should be possible to get the reputation balance of the DAO', () => {
    // const { reputation } = await dao.state().toPromise()
    // const balance = await reputation.balanceOf(address).toPromise()
  })

  it('get the list of daos', async () => {
    const daos = arc.daos()
    const daoList = await daos.pipe(first()).toPromise()
    expect(typeof daoList).toBe('object')
    expect(daoList.length).toBeGreaterThan(0)
  })

  it('get the dao state', async () => {
    const dao = await getTestDAO()
    expect(dao).toBeInstanceOf(DAO)
    const state = await dao.state().pipe(first()).toPromise()
    const expected = {
       address: dao.address,
       memberCount: 6,
       tokenBalance: new BN('0')
    }
    expect(state).toMatchObject(expected)
    expect(Object.keys(state)).toEqual([
      'address',
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
    await expect(reputation.state().toPromise()).rejects.toThrow(
      'Could not find a DAO with address 0xfake'
    )
  })

  it('dao.members() should work', async () => {
    const dao = await getTestDAO()
    const members = await dao.members().pipe(first()).toPromise()
    expect(typeof members).toEqual(typeof [])
    expect(members.length).toEqual(6)
    const member = members[0]
    const memberState = await member.state().pipe(first()).toPromise()
    expect(Number(fromWei(memberState.reputation))).toBeGreaterThan(0)
  })

  it('dao.member() should work', async () => {
    const dao = await getTestDAO()
    const member = await dao.member(arc.web3.eth.defaultAccount)
    expect(typeof member).toEqual(typeof [])
  })

  it('dao.ethBalance() should work', async () => {
    const dao = await getTestDAO()
    const previousBalance = await dao.ethBalance().pipe(first()).toPromise()

    await arc.web3.eth.sendTransaction({
      from: arc.web3.eth.defaultAccount,
      gas: 4000000,
      gasPrice: 100000000000,
      to: dao.address,
      value: toWei('1')
    })
    const newBalance = await dao.ethBalance().pipe(first()).toPromise()

    expect(Number(fromWei(newBalance.sub(previousBalance)))).toBe(1)
  })

})
