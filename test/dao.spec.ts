import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { BN } from './utils'
import { fromWei, getTestDAO, newArc, toWei } from './utils'

/**
 * DAO test
 */
describe('DAO', () => {
  let arc: Arc

  beforeAll(async () => {
    arc = await newArc()
})

  it('is instantiable', () => {
    const address = '0x12345'
    const dao = new DAO(address, arc)
    expect(dao).toBeInstanceOf(DAO)
  })

  it('collection is searchable', async () => {
    let result: DAO[]
    result = await DAO.search(arc).pipe(first()).toPromise()
    expect(result.length).toBeGreaterThan(1)
    result = await DAO.search(arc, { register: 'unRegistered'}).pipe(first()).toPromise()
    expect(result.length).toEqual(0)
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
    expect(Object.keys(state)).toEqual([
      'address',
      'memberCount',
      'name',
      'reputation',
      'reputationTotalSupply',
      'token',
      'tokenName',
      'tokenSymbol',
      'tokenTotalSupply'
    ])
    expect(state.address).toEqual(dao.address)
    // the created DAO has 6 members but other tests may add rep
    expect(state.memberCount).toBeGreaterThanOrEqual(5)
  })

  it('throws a reasonable error if the contract does not exist', async () => {
    expect.assertions(1)
    const reputation = new DAO('0xfake', arc)
    await expect(reputation.state().toPromise()).rejects.toThrow(
      'Could not find a DAO with address 0xfake'
    )
  })

  it('dao.member() should work', async () => {
    const dao = await getTestDAO()
    const member = await dao.member(arc.web3.eth.defaultAccount)
    expect(typeof member).toEqual(typeof [])
  })

  it('dao.members() should work', async () => {
    const dao = await getTestDAO()
    const members = await dao.members().pipe(first()).toPromise()
    expect(typeof members).toEqual(typeof [])
    expect(members.length).toBeGreaterThanOrEqual(6)
    const member = members[3]
    const memberState = await member.state().pipe(first()).toPromise()
    expect(Number(fromWei(memberState.reputation))).toBeGreaterThan(0)
  })

  it('dao.schemes() should work', async () => {
    const dao = await getTestDAO()
    let schemes = await dao.schemes().pipe(first()).toPromise()
    expect(typeof schemes).toEqual(typeof [])
    expect(schemes.length).toBeGreaterThanOrEqual(3)
    schemes = await dao.schemes({name: 'ContributionReward'}).pipe(first()).toPromise()
    expect(schemes.length).toBeGreaterThanOrEqual(1)
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
