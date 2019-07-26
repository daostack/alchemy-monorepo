import { Scheme } from '../src/scheme'
import { getTestDAO, newArc } from './utils'

jest.setTimeout(60000)
/**
 * Scheme test
 */
describe('Scheme', () => {

  it.skip('Test the whole flow', async () => {
    const arc = await newArc()
    const dao = await getTestDAO()

    const scheme = new Scheme({
        address: '0x1224',
        dao: dao.id,
        id: '0.x123455',
        name: 'ReputationFromToken',
        paramsHash: '0x124'
    }, arc)

    expect(scheme.ReputationFromToken).not.toBeFalsy()
    if (scheme.ReputationFromToken) {
      const amount = await scheme.ReputationFromToken.redemptionAmount(arc.web3.eth.defaultAccount)
      expect(amount).toEqual(0)
      await scheme.ReputationFromToken.redeem(arc.web3.eth.defaultAccount)
    }
  })

})
