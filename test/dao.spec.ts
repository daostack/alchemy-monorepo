import { DAO } from '../src/dao'
import { getArc, getContractAddresses } from './utils'

/**
 * DAO test
 */
describe('DAO', () => {
  let addresses: { [key: string]: string }

  beforeAll(() => {
    addresses = getContractAddresses()
  })

  it('DAO is instantiable', () => {
    const address = '0xa2A064b3B22fC892dfB71923a6D844b953AA247C'
    const dao = new DAO(address)
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

  it('get the list of daos', async done => {
    const arc = getArc()
    const daos = arc.daos()
    daos.subscribe({
      next: daoList => {
        // we should get a first result immediately
        expect(typeof daoList).toBe('object')
        expect(daoList.length).toBe(1)
        expect(daoList[0].address).toBe(addresses.Avatar.toLowerCase())
        done()
      }
    })
  })

  it('get the dao from Arc', async () => {
    const arc = getArc()
    const dao = arc.dao(addresses.Avatar)
    expect(dao).toBeInstanceOf(DAO)
  })
})
