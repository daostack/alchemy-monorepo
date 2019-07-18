import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { IProposalOutcome, Proposal } from '../src/proposal'
import { Vote } from '../src/vote'
import { createAProposal, firstResult,
  getTestAddresses, getTestDAO, ITestAddresses,
  newArc, waitUntilTrue } from './utils'

jest.setTimeout(20000)

describe('Vote on a ContributionReward', () => {

  let arc: Arc
  let addresses: ITestAddresses
  let dao: DAO
  let executedProposal: Proposal

  beforeAll(async () => {
    arc = await newArc()
    addresses = await getTestAddresses()
    dao = await getTestDAO()
    const { executedProposalId} = addresses.test
    executedProposal = await dao.proposal(executedProposalId)
    })

  it('works and gets indexed', async () => {
    const proposal = await createAProposal()
    const voteResponse = await proposal.vote(IProposalOutcome.Pass).send()
    const voteState0 = await voteResponse.result.fetchStaticState()
    expect(voteState0.result).toMatchObject({
      outcome : IProposalOutcome.Pass
    })

    let votes: Vote[] = []

    const voteIsIndexed = async () => {
      // we pass no-cache to make sure we hit the server on each request
      votes = await Vote.search(arc, {where: {proposal: proposal.id}}, { fetchPolicy: 'no-cache' })
        .pipe(first()).toPromise()
      return votes.length > 0
    }
    await waitUntilTrue(voteIsIndexed)

    expect(votes.length).toEqual(1)
    const vote = votes[0]
    const voteState = await vote.fetchStaticState()
    expect(voteState.proposal).toEqual(proposal.id)
    expect(voteState.dao).toEqual(dao.id)
    expect(voteState.outcome).toEqual(IProposalOutcome.Pass)
  })

  it('voting twice will not complain', async () => {
    const proposal = await createAProposal()
    await proposal.vote(IProposalOutcome.Pass).send()
    await proposal.vote(IProposalOutcome.Pass).send()
  })

  it('vote gets correctly indexed on the proposal entity', async () => {
    const proposal = await createAProposal()

    const voteHistory: Vote[][] = []
    Vote.search(arc, {where: {proposal: proposal.id}}).subscribe((next: Vote[]) => {
      voteHistory.push(next)
    })
    const lastVotes = () => {
      if (voteHistory.length > 0) {
       return voteHistory[voteHistory.length - 1]
     } else {
       return []
     }
    }
    await proposal.vote(IProposalOutcome.Pass).send()
    await waitUntilTrue(() => {
      const ls = lastVotes()
      return ls.length > 0
    })
    const proposalVotes = await proposal.votes().pipe(first()).toPromise()
    expect(proposalVotes.length = 1)
    const state = await proposalVotes[0].fetchStaticState()
    expect(state.outcome).toEqual(IProposalOutcome.Pass)
  })

  it('throws a meaningful error if the proposal does not exist', async () => {
    // a non-existing proposal
    const proposal = new Proposal(
      '0x1aec6c8a3776b1eb867c68bccc2bf8b1178c47d7b6a5387cf958c7952da267c2',
      arc
    )

    proposal.context.web3.eth.defaultAccount = arc.web3.eth.accounts.wallet[2].address
    await expect(proposal.vote(IProposalOutcome.Pass).send()).rejects.toThrow(
      /unknown proposal/i
    )
  })

  it('throws a meaningful error if the proposal was already executed', async () => {

    await expect(executedProposal.execute().send()).rejects.toThrow(
      /already executed/i
    )

    await expect(executedProposal.vote(IProposalOutcome.Pass).send()).rejects.toThrow(
      /already executed/i
    )
  })

  it('handles the case of voting without reputation nicely', async () => {
    // TODO: write this test!
    const proposal = await createAProposal()

    const accounts = arc.web3.eth.accounts.wallet
    const accountWithNoRep = accounts[6].address
    const reputation = await firstResult(dao.nativeReputation())
    const balance = await firstResult(reputation.reputationOf(accountWithNoRep))
    expect(balance.toString()).toEqual('0')
    arc.setAccount(accountWithNoRep) // a fake address
    await proposal.vote(IProposalOutcome.Pass)
    arc.setAccount(accounts[0].address)
  })

})
