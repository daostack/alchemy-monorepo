import { getContractAddressesFromMigration, realMathToNumber  } from '../src/utils'
import { BN } from './utils'

/**
 * Token test
 */
describe('Utils', () => {

  it('realMathToNumber works', () => {

    expect(realMathToNumber(new BN('4727698744810')).toFixed(5))
      .toEqual(Math.pow(1.2, 8).toFixed(5))
  })

  it('getTestAddresses works', () => {
    const addresses = getContractAddressesFromMigration()
    expect(addresses.length).toBeGreaterThan(0)
  })

})
