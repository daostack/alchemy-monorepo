import BN = require('bn.js')
import { IContractInfo } from '../src/arc'
import { realMathToNumber } from '../src/utils'
import { advanceTimeAndBlock, getContractAddressesFromMigration, newArc } from './utils'

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

  it('advanceTime works', async () => {
    const arc = await newArc()
    const web3 = arc.web3
    async function getBlockTime() {
      const block = await web3.eth.getBlock('latest')
      return block.timestamp
    }
    const blockTimeBefore  = await getBlockTime()
    const timeDelta = 900000
    await advanceTimeAndBlock(timeDelta)
    const blockTimeAfter  = await getBlockTime()
    // we expect the block times not to be perfectly alinged, but nearly so
    expect(Math.round((blockTimeAfter - blockTimeBefore) / 100)).toEqual(Math.round(timeDelta / 100))
  })

})
