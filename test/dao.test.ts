import { DAO } from '../src/dao'
import { getArc } from './utils'

/**
 * DAO test
 */
describe('DAO', () => {
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

  it.skip('get the dao from Arc', async () => {
    const arc = getArc()
    const daos = await arc.daos().toPromise()
    expect(daos.length).toBeGreaterThan(0)
  }, 10000)
})
