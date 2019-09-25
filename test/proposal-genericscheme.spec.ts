import { DAO } from '../src//dao'
import { Arc } from '../src/arc'
import {
  IProposalStage,
  IProposalState,
  Proposal
  } from '../src/proposal'
import { IGenericScheme} from '../src/schemes/genericScheme'
import { createAProposal, getTestAddresses, getTestDAO, ITestAddresses, LATEST_ARC_VERSION,
  newArc, voteToAcceptProposal, waitUntilTrue } from './utils'

jest.setTimeout(60000)

/**
 * Proposal test
 */
describe('Proposal', () => {
  let arc: Arc
  let testAddresses: ITestAddresses
  let dao: DAO

  beforeAll(async () => {
    arc = await newArc()
    testAddresses = getTestAddresses(arc)
    dao = await getTestDAO()
  })

  it.skip('the calldata argument must be provided', async () => {
    await expect(createAProposal(dao, {
      scheme: testAddresses.base.GenericScheme
    })).rejects.toThrow(/missing argument "callData"/i)
  })

  it('Check proposal state is correct', async () => {
    const states: IProposalState[] = []
    const lastState = (): IProposalState => states[states.length - 1]

    const actionMockABI = require(`@daostack/migration/abis/${LATEST_ARC_VERSION}/ActionMock.json`)
    const actionMock = new arc.web3.eth.Contract(actionMockABI, testAddresses.test.ActionMock)
    const callData = await actionMock.methods.test2(dao.id).encodeABI()

    const proposal = await createAProposal(dao, {
      callData,
      scheme: testAddresses.base.UGenericScheme,
      schemeToRegister: actionMock.options.address,
      value: 0
    })
    expect(proposal).toBeInstanceOf(Proposal)

    proposal.state().subscribe((pState: IProposalState) => {
      states.push(pState)
    })

    await waitUntilTrue(() => states.length > 0)

    expect(lastState().genericScheme).toMatchObject({
      callData,
      executed: false,
      returnValue: null
    })

    // accept the proposal by voting the hell out of it
    await voteToAcceptProposal(proposal)

    await waitUntilTrue(() => (lastState().genericScheme as IGenericScheme).executed)
    expect(lastState()).toMatchObject({
      stage: IProposalStage.Executed
    })
    expect(lastState().genericScheme).toMatchObject({
      callData,
      executed: true,
      returnValue: '0x0000000000000000000000000000000000000000000000000000000000000001'
    })
  })
})
