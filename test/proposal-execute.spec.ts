import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { IProposalOutcome, IProposalStage, IProposalState, IProposalType, Proposal } from '../src/proposal'
import { BN } from './utils'
import { createAProposal, fromWei, getTestAddresses, getTestDAO, ITestAddresses,
  newArc, timeTravel, toWei,
  voteToAcceptProposal, waitUntilTrue } from './utils'

jest.setTimeout(10000)

describe('Proposal execute()', () => {
  let arc: Arc
  let addresses: ITestAddresses
  let dao: DAO
  let executedProposal: Proposal

  beforeAll(async () => {
    arc = await newArc()
    addresses = await getTestAddresses()
    const { Avatar, executedProposalId} = addresses.test
    dao = arc.dao(Avatar.toLowerCase())
    executedProposal = await dao.proposal(executedProposalId)
  })

  it.only('runs correctly through the stages', async () => {

    const beneficiary = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'
    const accounts = arc.web3.eth.accounts.wallet
    const schemeAddress = executedProposal.schemeAddress
    console.log('schemeAddress', schemeAddress)

    const options = {
      beneficiary,
      dao: dao.address,
      ethReward: toWei('4'),
      externalTokenAddress: undefined,
      externalTokenReward: toWei('3'),
      nativeTokenReward: toWei('2'),
      reputationReward: toWei('1'),
      scheme: schemeAddress
    }

    let proposalState: IProposalState
    const proposalStates: IProposalState[] = []
    const lastState = () => proposalStates[proposalStates.length - 1]

    const proposal = (await dao.createProposal(options).send()).result

    proposal.state().subscribe(
      (next: IProposalState) => {
        proposalStates.push(next)
      },
      (error: Error) => { throw error }
    )

    // wait until the propsal is indexed
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

    const amountToStakeFor = toWei(10000)
    await proposal.stakingToken().mint(accounts[0].address, amountToStakeFor).send()
    await proposal.stakingToken().approveForStaking(proposal.votingMachineAddress, amountToStakeFor).send()
    await proposal.stake(IProposalOutcome.Pass, amountToStakeFor).send()

    await waitUntilTrue(() => lastState().stakesFor.gt(new BN(0)))
    proposalState = lastState()

    expect(Number(fromWei(proposalState.stakesFor))).toBeGreaterThan(0)
    expect(proposalState.stage).toEqual(IProposalStage.PreBoosted)

    // TODO: find out why the state is not updated to Boosted akreadt at this point
    await timeTravel(60000 * 60, arc.web3) // 30 minutes
    proposal.context.web3.eth.accounts.defaultAccount = accounts[2]
    await proposal.vote(IProposalOutcome.Pass).send()
    proposal.context.web3.eth.accounts.defaultAccount = accounts[0]

    await waitUntilTrue(() => {
      return lastState().stage === IProposalStage.Boosted
    })
    expect(lastState().stage).toEqual(IProposalStage.Boosted)
  })

  it('throws a meaningful error if the proposal does not exist', async () => {
    // a non-existing proposal
    const proposal = new Proposal(
      '0x1aec6c8a3776b1eb867c68bccc2bf8b1178c47d7b6a5387cf958c7952da267c2',
      dao.address,
      executedProposal.schemeAddress,
      executedProposal.votingMachineAddress,
      arc
    )
    await expect(proposal.execute().send()).rejects.toThrow(
      /does not exist/i
    )
  })

  it('execute a proposal by voting only', async () => {
    arc = dao.context
    // daoBalance
    const daoState = await dao.state().pipe(first()).toPromise()
    const repTotalSupply = daoState.reputationTotalSupply
    // const daoBalance = await dao.ethBalance().pipe(first()).toPromise()
    // expect(daoBalance).toEqual(new BN(0))

    const proposalStates: IProposalState[] = []

    const lastState = () => proposalStates[proposalStates.length - 1]
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
    expect(lastState().executedAt).toEqual(0)

    await voteToAcceptProposal(proposal)
    // wait until all votes have been counted
    await waitUntilTrue(() => {
      return lastState().executedAt !== 0
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
