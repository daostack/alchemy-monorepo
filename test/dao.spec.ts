import { first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { getArc, getContractAddresses } from './utils'

/**
 * DAO test
 */
describe('DAO', () => {
  let addresses: { [key: string]: string }
  let arc: Arc

  beforeAll(() => {
    addresses = getContractAddresses()
    arc = getArc()
  })

  it('DAO is instantiable', () => {
    const address = '0xa2A064b3B22fC892dfB71923a6D844b953AA247C'
    const dao = new DAO(address, arc)
    expect(dao).toBeInstanceOf(DAO)
  })

  it('should be possible to get the token balance of the DAO', () => {
    // const { token } = await dao.state.toPromise()
    // const balance = await token.balanceOf(address).toPromise()
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
    expect(daoList[daoList.length - 1].address).toBe(addresses.Avatar.toLowerCase())
  })

  it('get the dao state', async () => {
    const dao = arc.dao(addresses.Avatar.toLowerCase())
    expect(dao).toBeInstanceOf(DAO)
    const state = await dao.state.pipe(first()).toPromise()
    const expected = {
       address: addresses.Avatar.toLowerCase(),
       members: 0,
       name: 'Genesis Test'
    }
    expect(state).toMatchObject(expected)
    expect(Object.keys(state)).toEqual(['address', 'members', 'name', 'reputation', 'reputationTotalSupply',
      'token', 'tokenName', 'tokenSymbol', 'tokenTotalSupply'])
  })

  it('throws a reasonable error if the contract does not exist', async () => {
    expect.assertions(1)
    const reputation = new DAO('0xfake', arc)
    await expect(reputation.state.toPromise()).rejects.toThrow(
      'Could not find a DAO with address 0xfake'
    )
  })

  it('dao.proposals() should work', async () => {
    // TODO: because we have not setup with proposals, we are only testing if the current state returns the emty list
    const dao = arc.dao(addresses.Avatar.toLowerCase())
    const proposals = await dao.proposals().pipe(first()).toPromise()
    expect(proposals).toEqual([])
  })
})
