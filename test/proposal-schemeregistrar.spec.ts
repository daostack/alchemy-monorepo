import { Arc } from '../src/arc'
import {
  IProposalStage,
  IProposalState,
  IProposalType,
  ISchemeRegistrar,
  Proposal
  } from '../src/proposal'
import { Scheme } from '../src/scheme'
import { createAProposal, firstResult, getTestDAO, newArc, voteToAcceptProposal, waitUntilTrue } from './utils'

jest.setTimeout(30000)

/**
 * Proposal test
 */
describe('Proposal', () => {
  let arc: Arc

  beforeAll(async () => {
    arc = await newArc()
  })

  it('Check proposal state is correct', async () => {
    const dao = await getTestDAO()
    const schemeToRegister = arc.web3.eth.accounts.wallet[3].address
    const proposalToAdd = await createAProposal(dao, {
      descriptionHash: '',
      parametersHash: '0x0000000000000000000000000000000000000000000000000000000000001234',
      permissions: '0x0000001f',
      scheme: schemeToRegister,
      type: IProposalType.SchemeRegistrarAdd
    })

    expect(proposalToAdd).toBeInstanceOf(Proposal)
    const proposalToAddStates: IProposalState[] = []
    const lastProposalToAddState = (): IProposalState => proposalToAddStates[proposalToAddStates.length - 1]

    proposalToAdd.state().subscribe((pState: IProposalState) => {
      proposalToAddStates.push(pState)
    })

    await waitUntilTrue(() => proposalToAddStates.length > 1)

    expect(lastProposalToAddState().schemeRegistrar).toMatchObject({
      decision: null,
      schemeRegistered: null,
      schemeRemoved: null,
      schemeToRegister:  schemeToRegister.toLowerCase(),
      schemeToRegisterParamsHash: '0x0000000000000000000000000000000000000000000000000000000000001234',
      schemeToRegisterPermission: '0x0000001f',
      schemeToRemove: null
    })

    expect(lastProposalToAddState().type).toEqual('SchemeRegistrarAdd')

    // accept the proposal by voting the hell out of it
    await voteToAcceptProposal(proposalToAdd)

    await proposalToAdd.execute()
    await waitUntilTrue(() => (lastProposalToAddState().schemeRegistrar as ISchemeRegistrar).schemeRegistered)
    expect(lastProposalToAddState()).toMatchObject({
      stage: IProposalStage.Executed
    })
    expect(lastProposalToAddState().schemeRegistrar).toMatchObject({
      decision: '1',
      schemeRegistered: true
    })

    // we now expect our new scheme to appear in the schemes collection
    const registeredSchemes = await firstResult(Scheme.search({ dao: dao.address }, arc))
    expect(registeredSchemes.map((x: Scheme) => arc.web3.utils.toChecksumAddress(x.address)))
      .toContain(schemeToRegister)

    // we create a new proposal now to edit the scheme
    const proposalToEdit = await createAProposal(dao, {
      descriptionHash: '',
      parametersHash: '0x0000000000000000000000000000000000000000000000000000000000001234',
      permissions: '0x0000001f',
      scheme: schemeToRegister,
      type: IProposalType.SchemeRegistrarEdit
    })
    const proposalToEditStates: IProposalState[]  = []
    proposalToEdit.state().subscribe((pState: IProposalState) => {
      proposalToEditStates.push(pState)
    })
    const lastProposalToEditState = (): IProposalState => proposalToEditStates[proposalToEditStates.length - 1]

    await waitUntilTrue(() => proposalToEditStates.length > 1)

    expect(lastProposalToEditState().schemeRegistrar).toMatchObject({
      decision: null,
      // id: '0x11272ed228de85c4fd14ab467f1f8c6d6936ce3854e240f9a93c9deb95f243e6',
      schemeRegistered: null,
      schemeRemoved: null,
      schemeToRegister: schemeToRegister.toLowerCase(),
      schemeToRegisterParamsHash: '0x0000000000000000000000000000000000000000000000000000000000001234',
      schemeToRegisterPermission: '0x0000001f',
      schemeToRemove: null
    })
    expect(lastProposalToEditState().type).toEqual('SchemeRegistrarEdit')

    // we now uregister the new scheme
    const proposalToRemove = await createAProposal(dao, {
      scheme: schemeToRegister,
      type: IProposalType.SchemeRegistrarRemove
    })
    expect(proposalToRemove).toBeInstanceOf(Proposal)

    const proposalToRemoveStates: IProposalState[]  = []
    proposalToRemove.state().subscribe((pState: IProposalState) => {
      proposalToRemoveStates.push(pState)
    })
    const lastProposalToRemoveState = (): IProposalState => proposalToRemoveStates[proposalToRemoveStates.length - 1]

    await waitUntilTrue(() => proposalToRemoveStates.length > 1)

    expect(lastProposalToRemoveState().schemeRegistrar).toMatchObject({
      decision: null,
      schemeRegistered: null,
      schemeRemoved: null,
      schemeToRegister: null,
      schemeToRegisterParamsHash: null,
      schemeToRegisterPermission: null,
      schemeToRemove: schemeToRegister.toLowerCase()
    })

    // accept the proposal by voting the hell out of it
    await voteToAcceptProposal(proposalToRemove)
    await proposalToRemove.execute()
    await waitUntilTrue(() => (lastProposalToRemoveState().schemeRegistrar as ISchemeRegistrar).schemeRemoved)
    expect(lastProposalToRemoveState()).toMatchObject({
      stage: IProposalStage.Executed
    })
    expect(lastProposalToRemoveState().schemeRegistrar).toMatchObject({
      decision: '1',
      schemeRegistered: null,
      schemeRemoved: true,
      schemeToRegisterParamsHash: null,
      schemeToRegisterPermission: null,
      schemeToRemove: schemeToRegister.toLowerCase()
    })
    expect(lastProposalToRemoveState().type).toEqual('SchemeRegistrarRemove')

  })
})
