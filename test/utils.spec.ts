import { IContractInfo } from '../src/arc'
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
    let addresses: IContractInfo[]
    addresses = getContractAddressesFromMigration('private')
    expect(addresses.length).toBeGreaterThan(0)
    addresses = getContractAddressesFromMigration('rinkeby')
    expect(addresses.length).toBeGreaterThan(0)
    addresses = getContractAddressesFromMigration('mainnet')
    expect(addresses.length).toBeGreaterThan(0)
  })

})
