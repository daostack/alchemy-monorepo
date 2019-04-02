import BN = require('bn.js')
import { Arc } from '../src/arc'
import {
  IExecutionState,
  IProposalOutcome,
  IProposalStage,
  IProposalState,
  IProposalType,
  Proposal
  } from '../src/proposal'
import { createAProposal, getTestDAO, newArc, waitUntilTrue } from './utils'

jest.setTimeout(10000)

/**
 * Proposal test
 */
describe('Proposal', () => {
  let arc: Arc

  beforeAll(async () => {
    arc = newArc()
  })

  it('the calldata argument must be provided', async () => {
    const dao = await getTestDAO()
    expect(createAProposal(dao, {
      type: IProposalType.GenericScheme
    })).rejects.toThrow(/missing argument "callData"/i)
  })

  it('Check proposal state is correct', async () => {
    const dao = await getTestDAO()
    const actionMock = arc.getContract('ActionMock')

    const callData = await actionMock.methods.test2(dao.address).encodeABI()

    const proposal = await createAProposal(dao, {
      callData,
      type: IProposalType.GenericScheme,
      value: 0
    })
    expect(proposal).toBeInstanceOf(Proposal)
    const states: IProposalState[] = []

    proposal.state().subscribe((pState: IProposalState) => {
      states.push(pState)
    })

    await waitUntilTrue(() => states.length > 0 && states[states.length - 1] !== null)
    const proposalState = states[states.length - 1]
    expect(proposalState.genericScheme).toMatchObject({
      callData,
      executed: false,
      returnValue: null
    })

    // expect('Now exedcute').toEqual('this proposal')
  })
})
