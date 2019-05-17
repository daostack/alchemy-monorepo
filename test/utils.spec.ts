import { BN } from './utils'
import { realMathToNumber  } from '../src/utils'

/**
 * Token test
 */
describe('Utils', () => {

  it('realMathToNumber workds', () => {

    expect(realMathToNumber(new BN('4727698744810')).toFixed(5))
      .toEqual(Math.pow(1.2, 8).toFixed(5))
  })

})
