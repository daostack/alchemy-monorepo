import { first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { IExecutionState, IProposalOutcome, IProposalStage, IProposalState,
  IProposalType,
  Proposal } from '../src/proposal'
import { IContributionReward } from '../src/schemes/contributionReward'
import { BN } from './utils'
import { createAProposal,
  fromWei,
  getTestAddresses,
  ITestAddresses, newArc, toWei, waitUntilTrue } from './utils'

jest.setTimeout(20000)
/**
 * Proposal test
 */
describe('Proposal', () => {
  let arc: Arc
  let addresses: ITestAddresses
  let dao: DAO
  let executedProposal: Proposal
  let queuedProposal: Proposal
  let preBoostedProposal: Proposal

  beforeAll(async () => {
    arc = await newArc()
    addresses = await getTestAddresses()
    const { Avatar, executedProposalId, queuedProposalId, preBoostedProposalId } = addresses.test
    dao = arc.dao(Avatar.toLowerCase())
    // check if the executedProposalId indeed has the correct state
    executedProposal = await dao.proposal(executedProposalId)
    queuedProposal = await dao.proposal(queuedProposalId)
    preBoostedProposal = await dao.proposal(preBoostedProposalId)
  })

  it('get list of proposals', async () => {
    const proposals = dao.proposals()
    const proposalsList = await proposals.pipe(first()).toPromise()
    expect(typeof proposalsList).toBe('object')
    expect(proposalsList.length).toBeGreaterThan(0)
    expect(proposalsList.map((p) => p.id)).toContain(queuedProposal.id)
  })

  it('proposal.search() accepts expiresInQueueAt argument', async () => {
    const l1 = await Proposal.search(arc, {expiresInQueueAt_gt: 0}).pipe(first()).toPromise()
    expect(l1.length).toBeGreaterThan(0)

    const expiryDate = (await l1[0].state().pipe(first()).toPromise()).expiresInQueueAt
    const l2 = await Proposal.search(arc, {expiresInQueueAt_gt: expiryDate}).pipe(first()).toPromise()
    expect(l2.length).toBeLessThan(l1.length)
  })

  it('proposal.search() accepts scheme argument', async () => {
    const state = await queuedProposal.state().pipe(first()).toPromise()
    const l1 = await Proposal.search(arc, { scheme: state.scheme.id}).pipe(first()).toPromise()
    expect(l1.length).toBeGreaterThan(0)
  })

  it('proposal.search() accepts type argument', async () => {
    let ls: Proposal[]
    ls = await Proposal.search(arc, {type: IProposalType.ContributionReward}).pipe(first()).toPromise()
    expect(ls.length).toBeGreaterThan(0)
    ls = await Proposal.search(arc, {type: IProposalType.GenericScheme}).pipe(first()).toPromise()
    expect(ls.length).toBeGreaterThan(0)
    ls = await Proposal.search(arc, {type: IProposalType.SchemeRegistrarAdd}).pipe(first()).toPromise()
    // expect(ls.length).toEqual(0)
    ls = await Proposal.search(arc, {type: IProposalType.SchemeRegistrarRemove}).pipe(first()).toPromise()
    // expect(ls.length).toEqual(0)
  })

  it('proposal.search ignores case in address', async () => {
    const proposalState = await queuedProposal.state().pipe(first()).toPromise()
    const proposer = proposalState.proposer
    let result: Proposal[]

    result = await Proposal.search(arc, {proposer, id: queuedProposal.id}).pipe(first()).toPromise()
    expect(result.length).toEqual(1)

    result = await Proposal.search(arc, {proposer: proposer.toUpperCase(), id: queuedProposal.id})
      .pipe(first()).toPromise()
    expect(result.length).toEqual(1)

    result = await Proposal.search(arc, {proposer: arc.web3.utils.toChecksumAddress(proposer), id: queuedProposal.id})
      .pipe(first()).toPromise()
    expect(result.length).toEqual(1)

    result = await Proposal
      .search(arc, {dao: arc.web3.utils.toChecksumAddress(proposalState.dao.address), id: queuedProposal.id})
      .pipe(first()).toPromise()
    expect(result.length).toEqual(1)
  })

  it('dao.proposals() accepts different query arguments', async () => {
    const { queuedProposalId } = addresses.test
    const proposals = await dao.proposals({ stage: IProposalStage.Queued}).pipe(first()).toPromise()
    expect(typeof proposals).toEqual(typeof [])
    expect(proposals.length).toBeGreaterThan(0)
    expect(proposals.map((p: Proposal) => p.id)).toContain(queuedProposalId)
    // expect(proposals.map((p: Proposal) => p.id)).(executedProposalId)
  })

  it('get list of redeemable proposals for a user', async () => {
    // check if the executedProposalId indeed has the correct state
    const proposal = await dao.proposal(executedProposal.id)
    const proposalState = await proposal.state().pipe(first()).toPromise()
    expect(proposalState.accountsWithUnclaimedRewards.length).toEqual(4)
    const someAccount = proposalState.accountsWithUnclaimedRewards[1]
    // query for redeemable proposals
    const proposals = await dao.proposals({accountsWithUnclaimedRewards_contains: [someAccount]})
      .pipe(first()).toPromise()
    expect(proposals.length).toBeGreaterThan(0)

    const shouldBeJustThisExecutedProposal = await dao.proposals({
      accountsWithUnclaimedRewards_contains: [someAccount],
      id: proposal.id
    }).pipe(first()).toPromise()

    expect(shouldBeJustThisExecutedProposal.map((p: Proposal) => p.id)).toEqual([proposal.id])
  })

  it('get proposal dao', async () => {

    // const proposalDao = await proposal.dao.pipe(first()).toPromise()
    const proposal = executedProposal
    expect(proposal).toBeInstanceOf(Proposal)
    expect(proposal.dao.address).toEqual(dao.address)
  })

  it('state should be available before the data is indexed', async () => {
    const proposal = await createAProposal()
    const proposalState = await proposal.state().pipe(first()).toPromise()
    // the state is null because the proposal has not been indexed yet
    expect(proposalState).toEqual(null)
  })

  it.only('Check queued proposal state is correct', async () => {

    const proposal = queuedProposal
    const pState = await proposal.state().pipe(first()).toPromise()
    expect(proposal).toBeInstanceOf(Proposal)

    // TODO: these amounts seem odd, I guess not using WEI when proposal created?
    const contributionReward = pState.contributionReward as IContributionReward
    expect(fromWei(contributionReward.nativeTokenReward)).toEqual('10')
    expect(fromWei(pState.stakesAgainst)).toEqual('100')
    expect(fromWei(pState.stakesFor)).toEqual('0')
    expect(fromWei(contributionReward.reputationReward)).toEqual('10')
    expect(fromWei(contributionReward.ethReward)).toEqual('10')
    expect(fromWei(contributionReward.externalTokenReward)).toEqual('10')
    expect(fromWei(pState.votesFor)).toEqual('1000')
    expect(fromWei(pState.votesAgainst)).toEqual('1000')

    expect(pState).toMatchObject({
        boostedAt: 0,
        description: null,
        descriptionHash: '0x000000000000000000000000000000000000000000000000000000000000abcd',
        downStakeNeededToQueue: new BN(0),
        executedAt: 0,
        executionState: IExecutionState.None,
        genesisProtocolParams: {
          activationTime: 0,
          boostedVotePeriodLimit: 600,
          daoBountyConst: 10,
          limitExponentValue: 172,
          minimumDaoBounty: new BN('100000000000000000000'),
          preBoostedVotePeriodLimit: 600,
          proposingRepReward: new BN('5000000000000000000'),
          queuedVotePeriodLimit: 1800,
          queuedVoteRequiredPercentage: 50,
          quietEndingPeriod: 300,
          thresholdConst: 2,
          votersReputationLossRatio: 1
        },
        proposer: '0x90f8bf6a479f320ead074411a4b0e7944ea8c9c1',
        quietEndingPeriodBeganAt: 0,
        resolvedAt: 0,
        stage: IProposalStage.Queued,
        title: '',
        url: null,
        winningOutcome: IProposalOutcome.Fail
    })
    expect(pState.contributionReward).toMatchObject({
        beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
        periodLength: 0,
        periods: 1
    })

    expect(pState.queue.threshold).toBeGreaterThan(0)
    // check if the upstakeNeededToPreBoost value is correct
    //  (S+/S-) > AlphaConstant^NumberOfBoostedProposal.
    const boostedProposals = await pState.dao
      .proposals({stage: IProposalStage.Boosted}).pipe(first()).toPromise()
    const numberOfBoostedProposals = boostedProposals.length
    expect(pState.queue.threshold.toString())
      .toEqual(Math.pow(pState.genesisProtocolParams.thresholdConst, numberOfBoostedProposals).toString())

    expect(pState.stakesFor.add(pState.upstakeNeededToPreBoost).div(pState.stakesAgainst).toString())
      .toEqual(Math.pow(pState.genesisProtocolParams.thresholdConst, numberOfBoostedProposals).toString())
  })

  it('Check preboosted proposal state is correct', async () => {
    const proposal = preBoostedProposal
    const pState = await proposal.state().pipe(first()).toPromise()
    expect(proposal).toBeInstanceOf(Proposal)

    expect(pState.upstakeNeededToPreBoost).toEqual(new BN(0))
    // check if the upstakeNeededToPreBoost value is correct
    //  (S+/S-) > AlphaConstant^NumberOfBoostedProposal.
    const boostedProposals = await pState.dao
      .proposals({stage: IProposalStage.Boosted}).pipe(first()).toPromise()
    const numberOfBoostedProposals = boostedProposals.length

    expect(pState.stakesFor.div(pState.stakesAgainst.add(pState.downStakeNeededToQueue)).toString())
      .toEqual(Math.pow(pState.genesisProtocolParams.thresholdConst, numberOfBoostedProposals).toString())
  })

  it('get proposal rewards', async () => {
    const proposal = queuedProposal
    const rewards = await proposal.rewards().pipe(first()).toPromise()
    expect(rewards.length).toEqual(0)
    // TODO: write a test for a proposal that actually has rewards
  })

  it('get proposal stakes', async () => {
    const proposal = await createAProposal()
    const stakes: any[] = []
    proposal.stakes().subscribe((next) => stakes.push(next))

    const stakeAmount = toWei('18')
    await proposal.stakingToken().mint(arc.web3.eth.defaultAccount, stakeAmount).send()
    await arc.approveForStaking(proposal.votingMachine().options.address, stakeAmount).send()
    await proposal.stake(IProposalOutcome.Pass, stakeAmount).send()

    // wait until we have the we received the stake update
    await waitUntilTrue(() => stakes.length > 0 && stakes[stakes.length - 1].length > 0)
    expect(stakes[0].length).toEqual(0)
    expect(stakes[stakes.length - 1].length).toEqual(1)
  })

  it('state gets all updates', async () => {
    // TODO: write this test!
    const states: IProposalState[] = []
    const proposal = await createAProposal()
    proposal.state().subscribe(
      (state: any) => {
        states.push(state)
      },
      (err: any) => {
        throw err
      }
    )
    // vote for the proposal
    await proposal.vote(IProposalOutcome.Pass).pipe(first()).toPromise()

    // wait until all transactions are indexed
    await waitUntilTrue(() => {
      if (states.length > 2 && states[states.length - 1].votesFor.gt(new BN(0))) {
        return true
      } else {
        return false
      }
    })

    // we expect our first state to be null
    // (we just created the proposal and subscribed immediately)
    expect(Number(fromWei(states[states.length - 1].votesFor))).toBeGreaterThan(0)
    expect(states[states.length - 1].winningOutcome).toEqual(IProposalOutcome.Pass)
  })
})
