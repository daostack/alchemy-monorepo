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
import { createAProposal, fromWei, getTestDAO, newArc, waitUntilTrue } from './utils'

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
    expect(states).toEqual('xx')
    // expect(fromWei(proposalState.nativeTokenReward)).toEqual('10')
    // expect(fromWei(proposalState.stakesAgainst)).toEqual('0.0000001')
    // expect(fromWei(proposalState.stakesFor)).toEqual('0')
    // expect(fromWei(proposalState.reputationReward)).toEqual('10')
    // expect(fromWei(proposalState.ethReward)).toEqual('10')
    // expect(fromWei(proposalState.externalTokenReward)).toEqual('10')
    // expect(fromWei(proposalState.votesFor)).toEqual('1000')
    // expect(fromWei(proposalState.votesAgainst)).toEqual('1000')
    // expect(fromWei(proposalState.proposingRepReward)).toEqual('0.000000005')
    //
    // expect(proposalState).toMatchObject({
    //     beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
    //     boostedAt: 0,
    //     boostedVotePeriodLimit: 600,
    //     description: null,
    //     descriptionHash: '0x000000000000000000000000000000000000000000000000000000000000abcd',
    //     executedAt: null,
    //     executionState: IExecutionState.None,
    //     // externalToken: '0xff6049b87215476abf744eaa3a476cbad46fb1ca',
    //     periodLength: 0,
    //     periods: 1,
    //     preBoostedVotePeriodLimit: 600,
    //     proposer: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
    //     quietEndingPeriodBeganAt: null,
    //     resolvedAt: null,
    //     stage: IProposalStage.Queued,
    //     thresholdConst: 2199023255552,
    //     title: null,
    //     url: null,
    //     winningOutcome: IProposalOutcome.Fail
    // })
  })
})
