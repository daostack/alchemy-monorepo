import { Arc } from '../src/arc'
import {
  IProposalStage,
  IProposalState,
  IProposalType,
  ISchemeRegistrar,
  Proposal
  } from '../src/proposal'
import { createAProposal, getTestDAO, newArc, voteToAcceptProposal, waitUntilTrue } from './utils'

jest.setTimeout(30000)

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
    const dao = await getTestDAO()

    const proposal = await createAProposal(dao, {
      descriptionHash: '',
      parametersHash: '0x0000000000000000000000000000000000000000000000000000000000001234',
      permissions: '0x0000001f',
      scheme: arc.web3.eth.accounts.wallet[1].address,
      type: IProposalType.SchemeRegistrarPropose
    })

    expect(proposal).toBeInstanceOf(Proposal)
    const states: IProposalState[] = []
    const lastState = (): IProposalState => states[states.length - 1]

    proposal.state().subscribe((pState: IProposalState) => {
      states.push(pState)
    })

    await waitUntilTrue(() => states.length > 1)

    expect(lastState().schemeRegistrar).toMatchObject({
      decision: null,
      // id: '0x11272ed228de85c4fd14ab467f1f8c6d6936ce3854e240f9a93c9deb95f243e6',
      schemeRegistered: null,
      schemeRemoved: null,
      schemeToRegister:  arc.web3.eth.accounts.wallet[1].address.toLowerCase(),
      schemeToRegisterParamsHash: '0x0000000000000000000000000000000000000000000000000000000000001234',
      schemeToRegisterPermission: '0x0000001f',
      schemeToRemove: null
    })

    // accept the proposal by voting the hell out of it
    await voteToAcceptProposal(proposal)

    await waitUntilTrue(() => (lastState().schemeRegistrar as ISchemeRegistrar).schemeRegistered)
    expect(lastState()).toMatchObject({
      stage: IProposalStage.Executed
    })

    expect(lastState().schemeRegistrar).toMatchObject({
      decision: '1',
      schemeRegistered: true
    })

    // we now uregister the new scheme
    const proposalToUnregister = await createAProposal(dao, {
      scheme: arc.web3.eth.accounts.wallet[1].address,
      type: IProposalType.SchemeRegistrarProposeToRemove
    })
    expect(proposalToUnregister).toBeInstanceOf(Proposal)

    const unregisterStates: IProposalState[]  = []
    proposalToUnregister.state().subscribe((pState: IProposalState) => {
      unregisterStates.push(pState)
    })
    const lastUnregisterState = (): IProposalState => unregisterStates[unregisterStates.length - 1]

    await waitUntilTrue(() => unregisterStates.length > 1)

    expect(lastUnregisterState().schemeRegistrar).toMatchObject({
      decision: null,
      // id: '0x11272ed228de85c4fd14ab467f1f8c6d6936ce3854e240f9a93c9deb95f243e6',
      schemeRegistered: null,
      schemeRemoved: null,
      schemeToRegister: null,
      schemeToRegisterParamsHash: null,
      schemeToRegisterPermission: null,
      schemeToRemove: arc.web3.eth.accounts.wallet[1].address.toLowerCase()
    })

    // accept the proposal by voting the hell out of it
    await voteToAcceptProposal(proposalToUnregister)
    await waitUntilTrue(() => (lastUnregisterState().schemeRegistrar as ISchemeRegistrar).schemeRemoved)
    expect(lastUnregisterState()).toMatchObject({
      stage: IProposalStage.Executed
    })
    expect(lastUnregisterState().schemeRegistrar).toMatchObject({
      decision: '1',
      schemeRegistered: null,
      schemeRemoved: true,
      schemeToRegisterParamsHash: null,
      schemeToRegisterPermission: null,
      schemeToRemove: arc.web3.eth.accounts.wallet[1].address.toLowerCase()
    })

  })
})
