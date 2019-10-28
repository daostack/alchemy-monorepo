import { first } from 'rxjs/operators'
import {
  Arc,
  IGenericScheme,
  IProposalStage,
  IProposalState,
  ISchemeStaticState,
  Proposal
  } from '../src'
import { createAProposal, getTestAddresses, ITestAddresses, LATEST_ARC_VERSION,
  newArc, voteToPassProposal, waitUntilTrue } from './utils'

jest.setTimeout(60000)

/**
 * Proposal test
 */
describe('Proposal', () => {
  let arc: Arc
  let testAddresses: ITestAddresses

  beforeAll(async () => {
    arc = await newArc()
    testAddresses = getTestAddresses(arc)
  })

  it('Check proposal state is correct', async () => {
    const daos = await arc.daos({where: { name: 'Nectar DAO'}}).pipe(first()).toPromise()
    const dao = daos[0]
    const states: IProposalState[] = []
    const lastState = (): IProposalState => states[states.length - 1]

    const actionMockABI = require(`@daostack/migration/abis/${LATEST_ARC_VERSION}/ActionMock.json`)
    const actionMock = new arc.web3.eth.Contract(actionMockABI, testAddresses.test.ActionMock)
    const callData = await actionMock.methods.test2(dao.id).encodeABI()

    const schemes = await dao.schemes({ where: {name: 'GenericScheme' }}).pipe(first()).toPromise()
    const genericScheme = schemes[0].staticState as ISchemeStaticState
    const proposal = await createAProposal(dao, {
      callData,
      scheme: genericScheme.address,
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
    await voteToPassProposal(proposal)

    await waitUntilTrue(() => (lastState().genericScheme as IGenericScheme).executed)
    expect(lastState()).toMatchObject({
      stage: IProposalStage.Executed
    })
    expect(lastState().genericScheme).toMatchObject({
      callData,
      executed: true,
      returnValue: '0x'
    })
  })
})
