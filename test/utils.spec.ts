import BN = require('bn.js')
import { realMathToNumber  } from '../src/utils'

/**
 * Token test
 */
describe('Utils', () => {

  it('realMathToNumber works', () => {

    expect(realMathToNumber(new BN('4727698744810')).toFixed(5))
      .toEqual(Math.pow(1.2, 8).toFixed(5))
  })

})
