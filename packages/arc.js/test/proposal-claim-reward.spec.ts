import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { IProposalOutcome, IProposalStage, IProposalState, Proposal } from '../src/proposal'

import BN = require('bn.js')
import { createAProposal, firstResult, getTestAddresses, getTestDAO, ITestAddresses, LATEST_ARC_VERSION, newArc,
  toWei, voteToPassProposal, waitUntilTrue } from './utils'

jest.setTimeout(60000)

describe('Claim rewards', () => {
  let arc: Arc
  let testAddresses: ITestAddresses
  let dao: DAO

  beforeAll(async () => {
    arc = await newArc()
    testAddresses = getTestAddresses(arc)
    dao = await getTestDAO()
  })

  it('works for ether and native token', async () => {
    const beneficiary = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'
    const ethReward = new BN(12345)
    const nativeTokenReward = toWei('271828')
    const reputationReward = toWei('8008')
    const states: IProposalState[] = []
    const lastState = () => states[states.length - 1]

    // make sure that the DAO has enough Ether to pay forthe reward
    await arc.web3.eth.sendTransaction({
      gas: 4000000,
      gasPrice: 100000000000,
      to: dao.id,
      value: ethReward
    })
    const daoEthBalance = new BN(await arc.web3.eth.getBalance(dao.id))
    expect(Number(daoEthBalance.toString())).toBeGreaterThanOrEqual(Number(ethReward.toString()))

    const options = {
      beneficiary,
      dao: dao.id,
      ethReward,
      externalTokenAddress: undefined,
      externalTokenReward: toWei('0'),
      nativeTokenReward,
      reputationReward,
      scheme: testAddresses.base.ContributionReward
    }

    const response = await dao.createProposal(options).send()
    const proposal = response.result as Proposal

    // vote for the proposal
    await voteToPassProposal(proposal)
    // check if proposal is indeed accepted etc
    proposal.state().subscribe(((next) => states.push(next)))

    await waitUntilTrue(() => {
      return lastState() && lastState().stage === IProposalStage.Executed
    })

    const daoState = await firstResult(dao.state())
    const prevNativeTokenBalance = await firstResult(daoState.token.balanceOf(beneficiary))
    const reputationBalances: Array<BN> = []

    daoState.reputation.reputationOf(beneficiary).subscribe((next: BN) => {
      reputationBalances.push(next)
    })
    const prevEthBalance = new BN(await arc.web3.eth.getBalance(beneficiary))

    await proposal.claimRewards(beneficiary).send()

    const newNativeTokenBalance = await firstResult(daoState.token.balanceOf(beneficiary))
    expect(newNativeTokenBalance.sub(prevNativeTokenBalance).toString()).toEqual(nativeTokenReward.toString())

    const newethBalance = new BN(await arc.web3.eth.getBalance(beneficiary))
    expect(newethBalance.sub(prevEthBalance).toString()).toEqual(ethReward.toString())
    // no rewards were claimable yet
    await waitUntilTrue(() => reputationBalances.length === 2)
    // expect the repatution change to be equal or greater than the reward
    // (it could be higher because we may get rewards for voting)
    expect(Number(reputationBalances[1].sub(reputationBalances[0]).toString()))
      .toBeGreaterThanOrEqual(Number(reputationReward.toString()))
  })

  it('works for external token', async () => {
    const beneficiary = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'
    const externalTokenAddress = testAddresses.base.GEN
    const externalTokenReward = new BN(12345)

    await arc.GENToken().transfer(dao.id, externalTokenReward).send()
    const daoBalance =  await firstResult(arc.GENToken().balanceOf(dao.id))
    expect(Number(daoBalance.toString())).toBeGreaterThanOrEqual(Number(externalTokenReward.toString()))
    const options = {
      beneficiary,
      dao: dao.id,
      ethReward: new BN(0),
      externalTokenAddress,
      externalTokenReward,
      nativeTokenReward: new BN(0),
      reputationReward: new BN(0),
      scheme: testAddresses.base.ContributionReward
    }

    const response = await dao.createProposal(options).send()
    const proposal = response.result as Proposal

    // vote for the proposal with all the votest
    await voteToPassProposal(proposal)
    // check if prposal is indeed accepted etc
    const states: IProposalState[] = []
    proposal.state().subscribe(((next) => states.push(next)))
    const lastState = () => states[states.length - 1]

    await waitUntilTrue(() => {
      return lastState() && lastState().stage === IProposalStage.Executed
    })

    const prevTokenBalance = await firstResult(arc.GENToken().balanceOf(beneficiary))

    await proposal.claimRewards(beneficiary).send()

    const newTokenBalance = await firstResult(arc.GENToken().balanceOf(beneficiary))
    expect(newTokenBalance.sub(prevTokenBalance).toString()).toEqual(externalTokenReward.toString())

  })

  it('claimRewards should also work without providing a "beneficiary" argument', async () => {
    const proposal: Proposal = await createAProposal()
    await proposal.claimRewards().send()
  })

  it('claimRewards should also work for expired proposals', async () => {
     const proposal: Proposal = await arc.proposal(testAddresses.test.queuedProposalId)
     await proposal.claimRewards().send()
  })

  it('works with non-CR proposal', async () => {

    const version = '0.0.1-rc.32'
    testAddresses = getTestAddresses(arc)
    // dao = await getTestDAO()
    const ugenericSchemes = await arc.schemes({where: {name: "UGenericScheme", version}}).pipe(first()).toPromise()
    const ugenericScheme = ugenericSchemes[0]
    const ugenericSchemeState = await ugenericScheme.state().pipe(first()).toPromise()
    dao  = new DAO(ugenericSchemeState.dao, arc)

    const beneficiary = arc.web3.eth.defaultAccount
    const stakeAmount = new BN(123456789)
    await arc.GENToken().transfer(dao.id, stakeAmount).send()
    const actionMockABI = arc.getABI(undefined, 'ActionMock', LATEST_ARC_VERSION)
    const actionMock = new arc.web3.eth.Contract(actionMockABI, testAddresses.test.ActionMock)
    const callData = await actionMock.methods.test2(dao.id).encodeABI()

    const proposal = await createAProposal(dao, {
      callData,
      scheme: ugenericSchemeState.address,
      schemeToRegister: actionMock.options.address,
      value: 0
    })

    const proposalState = await proposal.fetchStaticState()
    await arc.GENToken().approveForStaking(proposalState.votingMachine, stakeAmount).send()
    await proposal.stake(IProposalOutcome.Pass, stakeAmount).send()

    // vote for the proposal with all the votest
    await voteToPassProposal(proposal)
    // check if prposal is indeed accepted etc
    const states: IProposalState[] = []
    proposal.state().subscribe(((next) => states.push(next)))
    const lastState = () => states[states.length - 1]

    await waitUntilTrue(() => {
      return lastState() && lastState().stage === IProposalStage.Executed
    })

    const prevBalance =  await firstResult(arc.GENToken().balanceOf(beneficiary))
    await proposal.claimRewards(beneficiary).send()
    const newBalance =  await firstResult(arc.GENToken().balanceOf(beneficiary))
    expect(newBalance.sub(prevBalance).toString()).toEqual(stakeAmount.toString())

  })

})
