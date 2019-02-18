import BN = require('bn.js');
import { first, take } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { IProposalState, Proposal, ProposalOutcome, ProposalStage } from '../src/proposal'
import { createAProposal, fromWei, getArc, getTestDAO, mineANewBlock, toWei, waitUntilTrue } from './utils'

jest.setTimeout(10000)

describe('Proposal execute()', () => {
  let arc: Arc

  beforeAll(async () => {
    arc = getArc()
  })

  it('runs correctly through the stages', async () => {

    const dao = await getTestDAO()
    const arc = await getArc()
    const beneficiary = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'
    const accounts = arc.web3.eth.accounts.wallet
    const options = {
      beneficiary,
      ethReward: toWei("4"),
      externalTokenAddress: undefined,
      externalTokenReward: toWei("3"),
      nativeTokenReward: toWei("2"),
      periodLength: 12,
      periods: 5,
      reputationReward: toWei("1"),
      type: 'ContributionReward'
    }
    const response = await dao.createProposal(options).send()
    const proposalId = (response.result as any).id
    // wait for the proposal to be indexed before subscribing to the state
    // TODO: change this once  https://github.com/daostack/client/issues/78 is resolved
    // const proposalIsIndexed = async () => {
    //   // we pass no-cache to make sure we hit the server on each request
    //   const proposals = await Proposal.search({id: proposalId}, arc, { fetchPolicy: 'no-cache' })
    //     .pipe(first()).toPromise()
    //   return proposals.length > 0
    // }
    // await waitUntilTrue(proposalIsIndexed)
    const proposal = new Proposal(proposalId, dao.address, arc)

    let proposalState
    let proposalIsIndexed: boolean = false
    const proposalStates: IProposalState[] = []
    proposal.state.subscribe(
      (next) => {
        if (next) {
          proposalIsIndexed = true
        }
        proposalStates.push(next)
      },
      (error: Error) => { throw error }
    )
    await waitUntilTrue(() => proposalIsIndexed)
    // check the state right after creation
    await waitUntilTrue(() => proposalStates.length > 1)
    expect(proposalStates[1].stage).toEqual(ProposalStage.Queued)

    // calling execute in this stage has no effect on the stage
    await proposal.execute().send()
    await waitUntilTrue(() => proposalStates.length > 2)
    proposalState = proposalStates[2]
    expect(proposalStates[2].stage).toEqual(ProposalStage.Queued)
    expect(proposalStates.length).toEqual(3)

    await proposal.vote(ProposalOutcome.Pass).send()
    // let's vote for the proposal with accounts[1]
    proposal.context.web3.eth.accounts.defaultAccount = accounts[1]
    await proposal.vote(ProposalOutcome.Pass).send()
    proposal.context.web3.eth.accounts.defaultAccount = accounts[0]

    // wait until the votes have been counted
    await waitUntilTrue(async () => {
      proposalState = proposalStates[proposalStates.length - 1]
      return proposalState.votesFor.gt(new BN(0))
    })
    expect(proposalState.stage).toEqual(ProposalStage.Queued)
    expect(Number(fromWei(proposalState.votesFor))).toBeGreaterThan(0)
    expect(fromWei(proposalState.votesAgainst)).toEqual("0")

    await proposal.stakingToken().mint(accounts[0].address, toWei("1000")).send()
    await proposal.stakingToken().approveForStaking(toWei("1000")).send()

    await proposal.stake(ProposalOutcome.Pass, toWei("200")).send()
    await waitUntilTrue(async () => {
      proposalState = proposalStates[proposalStates.length - 1]
      return proposalState.stakesFor.gt(new BN(0))
    })

    expect(Number(fromWei(proposalState.stakesFor))).toBeGreaterThan(0)
    expect(proposalState.stage).toEqual(ProposalStage.PreBoosted)
    return

  }, 10000)

  it.skip('throws a meaningful error if the proposal does not exist', async () => {
    const dao = await getTestDAO()
    // a non-existing proposal
    const proposal = new Proposal(
      '0x1aec6c8a3776b1eb867c68bccc2bf8b1178c47d7b6a5387cf958c7952da267c2', dao.address, arc
    )
    await expect(proposal.execute().send()).rejects.toThrow(
      /unknown proposal/i
    )
  })

  it.skip('throws a meaningful error if the proposal cannot be executed', async () => {
    const proposal = await createAProposal()
    await expect(proposal.execute().send()).rejects.toThrow(
      /proposal execution failed/i
    )
  })
})
