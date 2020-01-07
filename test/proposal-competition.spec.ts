import BN = require('bn.js')
import { first } from 'rxjs/operators'
import {
  Arc,
  Competition,
  CompetitionScheme,
  CompetitionSuggestion,
  CompetitionVote,
  DAO,
  ICompetitionProposal,
  IProposalStage,
  IProposalState,
  ISchemeState,
  Proposal
  } from '../src'
import { getBlockTime } from '../src/utils'
import {
  advanceTimeAndBlock,
  newArc,
  // revertToSnapShot,
  // takeSnapshot,
  toWei,
  voteToPassProposal,
  waitUntilTrue
 } from './utils'

jest.setTimeout(60000)

describe('Competition Proposal', () => {
  let arc: Arc
  let dao: DAO
  let contributionRewardExt: CompetitionScheme
  let contributionRewardExtState: ISchemeState
  // let snapshotId: any

  function addSeconds(date: Date, seconds: number) {
    if (!(date instanceof Date)) {
      throw Error(`Input should be a Date instance, got ${date} instead`)
    }
    const result = new Date()
    result.setTime(date.getTime() + (seconds * 1000))
    return result
  }

  beforeEach(async () => {
    // @ts-ignore
    // snapshotId = (await takeSnapshot()).result
  })

  beforeAll(async () => {
    arc = await newArc()
    // we'll get a `ContributionRewardExt` contract
    // find the corresponding scheme object
    // TODO: next lines will not work because of https://github.com/daostack/migration/issues/254
    // const ARC_VERSION = '0.0.1-rc.36'
    // const contributionRewardExtContract  = arc.getContractInfoByName(`ContributionRewardExt`, ARC_VERSION)
    // const contributionRewardExtAddres = contributionRewardExtContract.address
    const contributionRewardExtAddres = '0x68c29524E583380aF7896f7e63463740225Ac026'.toLowerCase()
    const contributionRewardExts = await arc
      .schemes({where: {address: contributionRewardExtAddres }}).pipe(first()).toPromise()

    contributionRewardExt = contributionRewardExts[0] as CompetitionScheme
    contributionRewardExtState = await contributionRewardExt.state().pipe(first()).toPromise()
    dao = new DAO(contributionRewardExtState.dao, arc)
  })

  afterEach(async () => {
    // await revertToSnapShot(snapshotId)
  })

  it('CompetitionSuggestion.calculateId works', async () => {
    function calc(scheme: string, suggestionId: number) {
      return CompetitionSuggestion.calculateId({scheme, suggestionId})

    }
    expect(calc('0xefc4d4e4ff5970c02572d90f8d580f534508f3377a17880e95c2ba9a6d670622',
                8))
      .toEqual('0x1c5a3d7aa889aff71dc8f5de18956b7b1e821c823f3f358d9eb74d18f135fa13')
    expect(calc('0xefc4d4e4ff5970c02572d90f8d580f534508f3377a17880e95c2ba9a6d670622',
                8))
      .toEqual('0x1c5a3d7aa889aff71dc8f5de18956b7b1e821c823f3f358d9eb74d18f135fa13')

    expect(calc('0xefc4d4e4ff5970c02572d90f8d580f534508f3377a17880e95c2ba9a6d670622',
                14))
      .toEqual('0x137446f8b5c791e505e6e8228801ed78555a4e35957fd0b026b70fc3f262b629')

  })

  it('create a competition proposal with starttime set to null', async () => {
    const scheme = new  CompetitionScheme(contributionRewardExt.id, arc)
    // TODO: test error handling for all these params
    // - all args are present
    // - order of times
    const now = await getBlockTime(arc.web3)
    const startTime = addSeconds(now, 2)
    const proposalOptions  = {
      dao: dao.id,
      endTime: addSeconds(startTime, 2000),
      ethReward: toWei('300'),
      externalTokenAddress: undefined,
      externalTokenReward: toWei('0'),
      nativeTokenReward: toWei('1'),
      numberOfVotesPerVoter: 3,
      proposalType: 'competition',
      reputationReward: toWei('10'),
      rewardSplit: [1, 2, 97],
      startTime: null,
      suggestionsEndTime: addSeconds(startTime, 1000),
      value: 0,
      votingStartTime: addSeconds(startTime, 200)
    }

    // CREATE PROPOSAL
    const tx = await scheme.createProposal(proposalOptions).send()
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
    expect((lastState().competition as ICompetitionProposal).startTime).toBeDefined()
  })

  it('Create a competition proposal, compete, win the competition..', async () => {
    // const scheme = new CompetitionScheme(contributionRewardExtState.id, arc)
    expect(contributionRewardExt).toBeInstanceOf(CompetitionScheme)
    const scheme = new  CompetitionScheme(contributionRewardExt.id, arc)

    const ethReward =  new BN(1000)
    // make sure that the DAO has enough Ether to pay forthe reward
    await arc.web3.eth.sendTransaction({
      gas: 4000000,
      gasPrice: 100000000000,
      to: dao.id,
      value: ethReward
    })
    const reputationReward = new BN(10101010)
    const externalTokenReward = new BN(0)
    const nativeTokenReward = new BN(0)

    // TODO: test error handling for all these params
    // - all args are present
    // - order of times
    const now = await getBlockTime(arc.web3)
    const startTime = addSeconds(now, 2)
    const proposalOptions  = {
      dao: dao.id,
      endTime: addSeconds(startTime, 200),
      ethReward,
      externalTokenAddress: undefined,
      externalTokenReward,
      nativeTokenReward,
      numberOfVotesPerVoter: 3,
      proposalType: 'competition',
      reputationReward,
      rewardSplit: [1, 2, 97],
      startTime,
      suggestionsEndTime: addSeconds(startTime, 100),
      value: 0,
      votingStartTime: addSeconds(startTime, 0)
    }

    const schemeState = await scheme.state().pipe(first()).toPromise()

    // CREATE PROPOSAL
    const tx = await scheme.createProposal(proposalOptions).send()
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
      ethReward,
      nativeTokenReward,
      reputationReward
    })
    expect(lastState().competition).toMatchObject({
      endTime: proposalOptions.endTime,
      numberOfVotesPerVoter: proposalOptions.numberOfVotesPerVoter,
      numberOfWinners: 3,
      rewardSplit: [1, 2, 97],
      snapshotBlock: null,
      startTime: proposalOptions.startTime,
      suggestionsEndTime: proposalOptions.suggestionsEndTime,
      votingStartTime: proposalOptions.votingStartTime
    })
    expect(lastState().scheme).toMatchObject({
      // TODO: this should be 'Competition'
      name: 'ContributionRewardExt'
      // name: 'Competition'
    })

    // accept the proposal by voting for et
    await voteToPassProposal(proposal)

    await waitUntilTrue(() => (lastState().stage === IProposalStage.Executed))
    expect(lastState()).toMatchObject({
      stage: IProposalStage.Executed
    })

    // check sanity for scheme
    expect(schemeState.address).toEqual(lastState().scheme.address)

    // redeem the proposal
    await proposal.claimRewards().send()

    // find the competition
    const competitions = await scheme.competitions({ where: {id: proposal.id}}).pipe(first()).toPromise()
    expect(competitions.length).toEqual(1)
    const competition = competitions[0]
    expect(competition).toBeInstanceOf(Competition)
    expect(competition.id).toEqual(proposal.id)

    // lets create some suggestions
    const suggestion1Options = {
      description: 'descxription',
      proposal: proposal.id,
      // tags: ['tag1', 'tag2'],
      title: 'title',
      url: 'https://somewhere.some.place'
    }

    const address0 = arc.web3.eth.accounts.wallet[0].address.toLowerCase()
    const address1 = arc.web3.eth.accounts.wallet[1].address.toLowerCase()
    // submit a suggestion by address1
    arc.setAccount(address1)
    const receipt1 = await competition.createSuggestion(suggestion1Options).send()
    arc.setAccount(address0)
    const suggestion1 = receipt1.result
    expect(suggestion1).toBeDefined()
    expect(suggestion1).toBeInstanceOf(CompetitionSuggestion)
    expect(suggestion1.id).toBeDefined()
    const suggestion2Options = { ...suggestion1Options, title: 'suggestion nr 2'}
    const receipt2 = await competition.createSuggestion(suggestion2Options).send()
    const suggestion2 = receipt2.result

    // we now should find 2 suggestions
    let suggestionIds: string[] = []
    competition.suggestions()
      .subscribe((ls: CompetitionSuggestion[]) => {
        suggestionIds = ls.map((x: CompetitionSuggestion) => x.id)
      })

    await waitUntilTrue(() => suggestionIds.indexOf(suggestion2.id) > -1)

    const suggestion1State = await suggestion1.state().pipe(first()).toPromise()
    expect(suggestion1State).toMatchObject({
      ...suggestion1Options,
      id: suggestion1.id,
      redeemedAt: null,
      rewardPercentage: 0,
      suggester: address1,
      title: 'title',
      totalVotes: new BN(0)
    })

    expect(suggestion1State).toEqual(await suggestion1.fetchStaticState())

    // filter suggestions by id, suggestionId, and proposal.id works
    expect(
      (await competition.suggestions({where: { proposal: competition.id}}).pipe(first()).toPromise()).length)
      .toEqual(2)

    expect(
      (await competition.suggestions({where: { id: suggestion2.id}}).pipe(first()).toPromise()).length)
      .toEqual(1)

    expect(
      (await competition.suggestions({where: { suggestionId: suggestion1State.suggestionId}})
        .pipe(first()).toPromise()).length)
      .toEqual(1)

    // // and lets vote for the first suggestion
    const voteReceipt = await scheme.voteSuggestion({ suggestionId: suggestion2.suggestionId}).send()
    const vote = voteReceipt.result
    // // the vote should be counted
    expect(vote).toBeInstanceOf(CompetitionVote)

    // we can also vote from the suggestion itself
    const vote1receipt = await suggestion1.vote().send()
    const vote1 = vote1receipt.result
    expect(vote1).toBeInstanceOf(CompetitionVote)

    let competitionVotes: CompetitionVote[] = []
    CompetitionVote.search(arc, {where: { suggestion: suggestion2.id}}).subscribe(
      (votes) => { competitionVotes = votes}
    )
    await waitUntilTrue(() => competitionVotes.length > 0)
    expect(competitionVotes.length).toEqual(1)

    // we can also find the votes on the suggestion
    const votesFromSuggestion: CompetitionVote[] = await suggestion2.votes().pipe(first()).toPromise()
    expect(votesFromSuggestion.map((r) => r.id)).toEqual(competitionVotes.map((r) => r.id))

    // if we claim our reward now, it should fail because the competion has not ended yet
    await expect(suggestion1.redeem().send()).rejects.toThrow(
      /competition is still on/i
    )
    await advanceTimeAndBlock(2000)

    // get the current balance of addres1 (who submitted suggestion1) before redeeming the suggestion
    const balanceBefore = new BN(await arc.web3.eth.getBalance(address1))
    await suggestion1.redeem().send()
    const balanceAfter = new BN(await arc.web3.eth.getBalance(address1))
    const balanceDelta = balanceAfter.sub(balanceBefore)
    expect(balanceDelta.toString()).not.toEqual('0')
    // TODO: write some tests for winners and their balances
    // console.log(balanceDelta.toString())
    // console.log(ethReward.toString())
    // expect(balanceDelta).toEqual(ethReward.muln(97).divn(100))
  })

  it('CompetionScheme is recognized', async () => {
    // we'll get a `ContributionRewardExt` contract that has a Compietion contract as a rewarder
    const ARC_VERSION = '0.0.1-rc.36'
    const contributionRewardExtContract  = arc.getContractInfoByName(`ContributionRewardExt`, ARC_VERSION)
    // find the corresponding scheme object
    const contributionRewardExts = await arc
      .schemes({where: {address: contributionRewardExtContract.address}}).pipe(first()).toPromise()
    expect(contributionRewardExts.length).toEqual(1)
    const scheme = contributionRewardExts[0]
    expect(scheme).toBeInstanceOf(CompetitionScheme)
  })

  it('Can create a propsal using dao.createProposal', async () => {
    const now = await getBlockTime(arc.web3)
    const startTime = addSeconds(now, 2)
    const proposalOptions  = {
      beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
      dao: dao.id,
      endTime: addSeconds(startTime, 3000),
      ethReward: toWei('300'),
      externalTokenAddress: undefined,
      externalTokenReward: toWei('0'),
      nativeTokenReward: toWei('1'),
      numberOfVotesPerVoter: 3,
      proposalType: 'competition',
      reputationReward: toWei('10'),
      rewardSplit: [10, 10, 80],
      scheme: contributionRewardExtState.address,
      startTime,
      suggestionsEndTime: addSeconds(startTime, 100),
      value: 0,
      votingStartTime: addSeconds(startTime, 0)
    }

    const tx = await dao.createProposal(proposalOptions).send()
    const proposal = tx.result
    expect(proposal).toBeInstanceOf(Proposal)

  })
})
