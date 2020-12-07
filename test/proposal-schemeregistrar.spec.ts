import { Arc } from '../src/arc'
import {
  IProposalStage,
  IProposalState,
  IProposalType,
  Proposal
  } from '../src/proposal'
import { Scheme } from '../src/scheme'
import { ISchemeRegistrar } from '../src/schemes/schemeRegistrar'
import { createAProposal, firstResult, getTestAddresses, getTestDAO,
  newArc, voteToPassProposal, waitUntilTrue } from './utils'

jest.setTimeout(60000)

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
    const schemeToRegister = arc.web3.eth.accounts.create().address.toLowerCase()
    const proposalToAddStates: IProposalState[] = []
    const lastProposalToAddState = (): IProposalState => proposalToAddStates[proposalToAddStates.length - 1]
    //false because no schemename is undefined and scheme does not exist in contractInfo
    expect(await arc.verifyParametersHash(schemeToRegister,'0x0000000000000000000000000000000000000000000000000000000000001234')).toBe(false)
   //true because no "dummyscheme" not exist
    expect(await arc.verifyParametersHash(schemeToRegister,'0x0000000000000000000000000000000000000000000000000000000000001234',"dummyscheme")).toBe(true)
    //false because parametersHash is not set in this scheme
    expect(await arc.verifyParametersHash(getTestAddresses(arc).base.SchemeRegistrar,'0x0000000000000000000000000000000000000000000000000000000000001234')).toBe(false)
    //true because all is fine
    expect(await arc.verifyParametersHash(getTestAddresses(arc).base.SchemeRegistrar,'0xb8ba347e9b4e9912eb12487e91b9dabd0aaead43120329237ad9eaba3d88a03b')).toBe(true)


    const proposalToAdd = await createAProposal(dao, {
      descriptionHash: '',
      parametersHash: '0x0000000000000000000000000000000000000000000000000000000000001234',
      permissions: '0x0000001f',
      scheme: getTestAddresses(arc).base.SchemeRegistrar,
      schemeToRegister,
      type: IProposalType.SchemeRegistrarAdd
    })
    proposalToAdd.state().subscribe((pState: IProposalState) => {
      proposalToAddStates.push(pState)
    })

    await waitUntilTrue(() => proposalToAddStates.length > 0)

    expect(lastProposalToAddState().schemeRegistrar).toMatchObject({
      decision: null,
      schemeRegistered: null,
      schemeRemoved: null,
      schemeToRegister,
      schemeToRegisterParamsHash: '0x0000000000000000000000000000000000000000000000000000000000001234',
      schemeToRegisterPermission: '0x0000001f',
      schemeToRemove: null
    })

    expect(lastProposalToAddState().type).toEqual('SchemeRegistrarAdd')

    // accept the proposal by voting the hell out of it
    await voteToPassProposal(proposalToAdd)

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
    const registeredSchemes = await firstResult(Scheme.search(arc, {where: { dao: dao.id }}))
    const registeredSchemesAddresses: string[] = []
    await Promise.all(
      registeredSchemes.map(async (x: Scheme) => {
        const state = await x.fetchStaticState()
        registeredSchemesAddresses.push(state.address)
      })
    )
    expect(registeredSchemesAddresses).toContain(schemeToRegister)

    // we create a new proposal now to edit the scheme
    const proposalToEdit = await createAProposal(dao, {
      descriptionHash: '',
      parametersHash: '0x0000000000000000000000000000000000000000000000000000000000001234',
      permissions: '0x0000001f',
      scheme: getTestAddresses(arc).base.SchemeRegistrar,
      schemeToRegister: schemeToRegister.toLowerCase(),
      type: IProposalType.SchemeRegistrarEdit
    })
    const proposalToEditStates: IProposalState[]  = []
    proposalToEdit.state().subscribe((pState: IProposalState) => {
      proposalToEditStates.push(pState)
    })
    const lastProposalToEditState = (): IProposalState => proposalToEditStates[proposalToEditStates.length - 1]

    await waitUntilTrue(() => proposalToEditStates.length > 0)

    expect(lastProposalToEditState().schemeRegistrar).toMatchObject({
      decision: null,
      // id: '0x11272ed228de85c4fd14ab467f1f8c6d6936ce3854e240f9a93c9deb95f243e6',
      schemeRegistered: null,
      schemeRemoved: null,
      schemeToRegister,
      schemeToRegisterParamsHash: '0x0000000000000000000000000000000000000000000000000000000000001234',
      schemeToRegisterPermission: '0x0000001f',
      schemeToRemove: null
    })
    expect(lastProposalToEditState().type).toEqual('SchemeRegistrarEdit')

    // we now uregister the new scheme
    const proposalToRemove = await createAProposal(dao, {
      scheme: getTestAddresses(arc).base.SchemeRegistrar,
      schemeToRegister,
      type: IProposalType.SchemeRegistrarRemove
    })
    expect(proposalToRemove).toBeInstanceOf(Proposal)

    const proposalToRemoveStates: IProposalState[]  = []
    proposalToRemove.state().subscribe((pState: IProposalState) => {
      proposalToRemoveStates.push(pState)
    })
    const lastProposalToRemoveState = (): IProposalState => proposalToRemoveStates[proposalToRemoveStates.length - 1]

    await waitUntilTrue(() => proposalToRemoveStates.length > 0)

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
    await voteToPassProposal(proposalToRemove)
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
