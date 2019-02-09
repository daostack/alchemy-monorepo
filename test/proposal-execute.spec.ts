import { first, take } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { IProposalState, Proposal, ProposalOutcome, ProposalStage } from '../src/proposal'
import { createAProposal, getArc, getTestDAO, mineANewBlock, waitUntilTrue } from './utils'

describe('Proposal execute()', () => {
  let arc: Arc

  beforeAll(async () => {
    arc = getArc()
  })

  it('runs correctly through the stages', async () => {

    const dao = await getTestDAO()
    const beneficiary = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'
    const accounts = arc.web3.eth.accounts.wallet
    const options = {
      beneficiary,
      ethReward: 4,
      externalTokenAddress: undefined,
      externalTokenReward: 3,
      nativeTokenReward: 2,
      periodLength: 12,
      periods: 5,
      reputationReward: 1,
      type: 'ContributionReward'
    }
    const response = await dao.createProposal(options).pipe(take(2)).toPromise()
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
        // console.log(next)
        console.log(proposalIsIndexed)
        if (next) {
          proposalIsIndexed = true
        }
        proposalStates.push(next)
      },
      (error: Error) => { throw error }
    )
    await waitUntilTrue(() => proposalIsIndexed)
    function getCurrentState(propId: string) {
        const prop = new  Proposal(propId, dao.address, arc)
        return prop.state.pipe(first()).toPromise()
    }

    // check the state right after creation
    await waitUntilTrue(() => proposalStates.length > 1)
    expect(proposalStates[1].stage).toEqual(ProposalStage.Queued)

    // calling execute in this stage has no effect on the stage
    await proposal.execute().pipe(take(2)).toPromise()
    await waitUntilTrue(() => proposalStates.length > 2)
    proposalState = await getCurrentState(proposalId)
    expect(proposalStates[2].stage).toEqual(ProposalStage.Queued)
    expect(proposalStates.length).toEqual(3)

    await proposal.vote(ProposalOutcome.Pass).pipe(take(2)).toPromise()
    // let's vote for the proposal with accounts[1]
    proposal.context.web3.eth.accounts.defaultAccount = accounts[1]
    await proposal.vote(ProposalOutcome.Pass).pipe(take(2)).toPromise()
    proposal.context.web3.eth.accounts.defaultAccount = accounts[0]

    // const daoState = await dao.state.pipe(first()).toPromise()
    // const daoReputation =  daoState.reputation
    // console.log(await daoReputation.reputationOf(accounts[0].address).pipe(first()).toPromise())
    // console.log(await daoReputation.reputationOf(accounts[1].address).pipe(first()).toPromise())

    // wait until the votes have been counted
    await waitUntilTrue(async () => {
      proposalState = await getCurrentState(proposalId)
      return proposalState.votesFor > 0
    })
    expect(proposalState.stage).toEqual(ProposalStage.Queued)
    expect(proposalState.votesFor).toBeGreaterThan(0)
    expect(proposalState.votesAgainst).toEqual(0)

    return
  }, 10000)

  it.skip('throws a meaningful error if the proposal does not exist', async () => {
    const dao = await getTestDAO()
    // a non-existing proposal
    const proposal = new Proposal(
      '0x1aec6c8a3776b1eb867c68bccc2bf8b1178c47d7b6a5387cf958c7952da267c2', dao.address, arc
    )
    await expect(proposal.execute().pipe(take(2)).toPromise()).rejects.toThrow(
      /unknown proposal/i
    )
  })

  it.skip('throws a meaningful error if the proposal cannot be executed', async () => {
    const proposal = await createAProposal()
    await expect(proposal.execute().pipe(take(2)).toPromise()).rejects.toThrow(
      /proposal execution failed/i
    )
  })
})
