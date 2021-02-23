import { first } from 'rxjs/operators'
import {
  Arc,
  DAO,
  IProposalStage,
  IProposalState,
  Proposal
  } from '../src'
import { newArc, toWei, voteToPassProposal, waitUntilTrue } from './utils'

jest.setTimeout(60000)

/**
 * Proposal test
 */
describe('ContributionReward Ext', () => {
  let arc: Arc

  beforeAll(async () => {
    arc = await newArc()
  })

  it.skip('Create a proposal, accept it, execute it', async () => {
    // TODO: we are skipping this test, because we do not ahve at this point a contributionrewardext
    // contract in our test environment that is not a Competition scheme..

    // we'll get a `ContributionRewardExt` contract
    const ARC_VERSION = '0.0.1-rc.36'
    const contributionRewardExtContract  = arc.getContractInfoByName(`ContributionRewardExt`, ARC_VERSION)
    // find the corresponding scheme object
    const contributionRewardExts = await arc
      .schemes({where: {address: contributionRewardExtContract.address}}).pipe(first()).toPromise()

    const contributionRewardExt = contributionRewardExts[0]
    const contributionRewardExtState = await contributionRewardExt.state().pipe(first()).toPromise()
    const dao = new DAO(contributionRewardExtState.dao, arc)

    const tx = await dao.createProposal({
      beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
      dao: dao.id,
      ethReward: toWei('300'),
      externalTokenAddress: undefined,
      externalTokenReward: toWei('0'),
      nativeTokenReward: toWei('1'),
      reputationReward: toWei('10'),
      scheme: contributionRewardExtState.address,
      value: 0
    }).send()
    const proposal = tx.result
    expect(proposal).toBeInstanceOf(Proposal)

    const states: IProposalState[] = []
    const lastState = (): IProposalState => states[states.length - 1]
    proposal.state().subscribe((pState: IProposalState) => {
      states.push(pState)
    })
    await waitUntilTrue(() => !!lastState())

    expect(lastState()).toMatchObject({
      stage: IProposalStage.Queued
    })
    expect(lastState().contributionReward).toMatchObject({
      alreadyRedeemedEthPeriods: 0,
      ethReward: toWei('300'),
      nativeTokenReward: toWei('1'),
      reputationReward: toWei('10')
    })

    // accept the proposal by voting the hell out of it
    await voteToPassProposal(proposal)

    await waitUntilTrue(() => (lastState().stage === IProposalStage.Executed))
    expect(lastState()).toMatchObject({
      stage: IProposalStage.Executed
    })
  })
})
