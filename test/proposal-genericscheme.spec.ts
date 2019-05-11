import BN = require('bn.js')
import { Arc } from '../src/arc'
import {
  IProposalStage,
  IProposalState,
  IProposalType,
  Proposal
  } from '../src/proposal'
import {   IGenericScheme } from '../src/schemes/genericScheme'
import { getWeb3Options } from '../src/utils'
import { createAProposal, getContractAddressesFromMigration, getTestDAO, newArc,
  voteToAcceptProposal, waitUntilTrue } from './utils'

jest.setTimeout(20000)

/**
 * Proposal test
 */
describe('Proposal', () => {
  let arc: Arc

  beforeAll(async () => {
    arc = await newArc()
  })

  it('the calldata argument must be provided', async () => {
    const dao = await getTestDAO()
    expect(createAProposal(dao, {
      type: IProposalType.GenericScheme
    })).rejects.toThrow(/missing argument "callData"/i)
  })

  it('Check proposal state is correct', async () => {
    const addresses = await getContractAddressesFromMigration()
    const dao = await getTestDAO()
    const contractClass = require('@daostack/arc/build/contracts/ActionMock.json')
    const opts = getWeb3Options(arc.web3)
    const actionMock = new arc.web3.eth.Contract(contractClass.abi, addresses.base.ActionMock, opts)

    const callData = await actionMock.methods.test2(dao.address).encodeABI()

    const proposal = await createAProposal(dao, {
      callData,
      type: IProposalType.GenericScheme,
      value: 0
    })
    expect(proposal).toBeInstanceOf(Proposal)
    const states: IProposalState[] = []
    const lastState = (): IProposalState => states[states.length - 1]

    proposal.state().subscribe((pState: IProposalState) => {
      states.push(pState)
    })

    await waitUntilTrue(() => states.length > 1)

    expect(lastState().genericScheme).toMatchObject({
      callData,
      executed: false,
      returnValue: null
    })

    // accept the proposal by voting the hell out of it
    await voteToAcceptProposal(proposal)

    await proposal.execute()
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
