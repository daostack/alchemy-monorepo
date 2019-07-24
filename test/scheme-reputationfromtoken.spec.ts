import { ReputationFromTokenScheme } from '../src/schemes/reputationFromToken'
import { getTestDAO, newArc } from './utils'

jest.setTimeout(20000)

/**
 * Scheme test
 */
describe('Scheme', () => {

  it('Test the whole flow', async () => {
    // deploy the FixedReputationAllocation contrat
    // const contractInfo =   require(`@daostack/arc/build/contracts/ReputationFromToken.json`)
    //
    // const contract = new arc.web3.eth.Contract(contractInfo.abi)
    // await contract.deploy({ data: contractInfo.bytecode})
    const arc = await newArc()
    const dao = await getTestDAO()

    const scheme = new ReputationFromTokenScheme({
        address: '0x1224',
        dao: dao.id,
        id: '0x123455',
        name: 'ReputationFromToken',
        paramsHash: '0x124'
    }, arc)

    const amount = await scheme.redemptionAmount(arc.web3.eth.defaultAccount)
    expect(amount).toEqual(0)

  })

})
