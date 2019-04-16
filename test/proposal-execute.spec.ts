import BN = require('bn.js')
import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { IProposalOutcome, IProposalStage, IProposalState, Proposal } from '../src/proposal'
import { createAProposal, fromWei, getTestDAO, newArc, timeTravel, toWei, waitUntilTrue } from './utils'

jest.setTimeout(10000)

describe('Proposal execute()', () => {
  let arc: Arc

  beforeAll(async () => {
    arc = await newArc()
  })

  it.only('runs correctly through the stages', async () => {

    const dao = await getTestDAO()
    const beneficiary = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'
    const accounts = arc.web3.eth.accounts.wallet
    const options = {
      beneficiary,
      ethReward: toWei('4'),
      externalTokenAddress: undefined,
      externalTokenReward: toWei('3'),
      nativeTokenReward: toWei('2'),
      periodLength: 12,
      periods: 5,
      reputationReward: toWei('1'),
      type: 'ContributionReward'
    }
    const response = await dao.createProposal(options).send()
    const proposalId = (response.result as any).id

    const proposal = new Proposal(proposalId, dao.address, arc)

    let proposalState
    let proposalIsIndexed: boolean = false
    const proposalStates: IProposalState[] = []
    proposal.state().subscribe(
      (next: IProposalState) => {
        if (next) {
          proposalIsIndexed = true
        }
        proposalStates.push(next)
      },
      (error: Error) => { throw error }
    )
    const lastState = () => proposalStates[proposalStates.length - 1]
    await waitUntilTrue(() => proposalIsIndexed)
    // check the state right after creation
    await waitUntilTrue(() => proposalStates.length > 1)
    expect(proposalStates[1].stage).toEqual(IProposalStage.Queued)

    // calling execute in this stage has no effect on the stage
    await proposal.execute().send()

    await proposal.vote(IProposalOutcome.Pass).send()
    // let's vote for the proposal with accounts[1]
    proposal.context.web3.eth.accounts.defaultAccount = accounts[1]
    await proposal.vote(IProposalOutcome.Pass).send()
    proposal.context.web3.eth.accounts.defaultAccount = accounts[0]

    // wait until the votes have been counted
    await waitUntilTrue(() => lastState().votesFor.gt(new BN(0)))
    proposalState = lastState()
    expect(proposalState.stage).toEqual(IProposalStage.Queued)
    expect(Number(fromWei(proposalState.votesFor))).toBeGreaterThan(0)
    expect(fromWei(proposalState.votesAgainst)).toEqual('0')

    await proposal.stakingToken().mint(accounts[0].address, toWei('1000')).send()
    await proposal.stakingToken().approveForStaking(toWei('1000')).send()

    await proposal.stake(IProposalOutcome.Pass, toWei('200')).send()

    await waitUntilTrue(() => lastState().stakesFor.gt(new BN(0)))
    proposalState = lastState()

    expect(Number(fromWei(proposalState.stakesFor))).toBeGreaterThan(0)
    expect(proposalState.stage).toEqual(IProposalStage.PreBoosted)

    // TODO: find out why the state is not updated to Boosted
    await timeTravel(60000 * 60, arc.web3) // 30 minutes
    proposal.context.web3.eth.accounts.defaultAccount = accounts[2]
    await proposal.vote(IProposalOutcome.Pass).send()
    proposal.context.web3.eth.accounts.defaultAccount = accounts[0]

    await waitUntilTrue(() => {
      return lastState().stage === IProposalStage.Boosted
    })
    expect(lastState().stage).toEqual(IProposalStage.Boosted)
  }, 10000)

  it('throws a meaningful error if the proposal does not exist', async () => {
    const dao = await getTestDAO()
    // a non-existing proposal
    const proposal = new Proposal(
      '0x1aec6c8a3776b1eb867c68bccc2bf8b1178c47d7b6a5387cf958c7952da267c2', dao.address, arc
    )
    await expect(proposal.execute().send()).rejects.toThrow(
      /does not exist/i
    )
  })

  it('execute a proposal by voting only', async () => {
    const dao = await getTestDAO()
    arc = dao.context
    // daoBalance
    const daoState = await dao.state().pipe(first()).toPromise()
    const repTotalSupply = daoState.reputationTotalSupply
    // const daoBalance = await dao.ethBalance().pipe(first()).toPromise()
    // expect(daoBalance).toEqual(new BN(0))

    const proposalStates: IProposalState[] = []

    const lastState = () => proposalStates[proposalStates.length - 1]
    const accounts = arc.web3.eth.accounts.wallet
    const proposal = await createAProposal(dao,  { ethReward: new BN(0)})
    proposal.state().subscribe((state) => {
      proposalStates.push(state)
    })
    // calling "execute" immediately will have no effect, because the proposal is not
    await waitUntilTrue(() => proposalStates.length === 2)
    expect(proposalStates[proposalStates.length - 1].stage).toEqual(IProposalStage.Queued)
    // this execution will not change the state, because the quorum is not met
    await proposal.execute().send()
    expect(lastState().stage).toEqual(IProposalStage.Queued)
    expect(lastState().executedAt).toEqual(null)

    proposal.context.web3.eth.accounts.defaultAccount = accounts[0]
    await proposal.vote(IProposalOutcome.Pass).send()
    // let's vote for the proposal with accounts[1]
    arc.setAccount(accounts[1].address)
    const response = await proposal.vote(IProposalOutcome.Pass).send()
    // check if the "from" address is as expected
    expect(response.receipt.from).toEqual(accounts[1].address.toLowerCase())

    arc.setAccount(accounts[2].address)
    await proposal.vote(IProposalOutcome.Pass).send()

    arc.setAccount(accounts[3].address)
    await proposal.vote(IProposalOutcome.Pass).send()

    arc.setAccount(accounts[0].address)

    // wait until all votes have been counted
    await waitUntilTrue(() => {
      return lastState().votesCount === 4
    })
    expect(Number(lastState().votesFor.toString())).toBeGreaterThan(Number(repTotalSupply.div(new BN(2)).toString()))

    /// with the last (winning) vote, the proposal is already executed
    await expect(proposal.execute().send()).rejects.toThrow(
      /already executed/i
    )

    // check the state
    expect(lastState().stage).toEqual(IProposalStage.Executed)
    expect(lastState().executedAt).not.toEqual(null)
  })
})
