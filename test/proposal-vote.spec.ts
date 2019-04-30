import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { IProposalOutcome, Proposal } from '../src/proposal'
import { Vote } from '../src/vote'
import { createAProposal, getTestDAO, newArc, waitUntilTrue } from './utils'

describe('Vote on a ContributionReward', () => {
  let arc: Arc
  let dao: DAO

  beforeAll(async () => {
    arc = await newArc()
    dao = await getTestDAO()
  })

  it('works and gets indexed', async () => {
    const proposal = await createAProposal()
    const voteResponse = await proposal.vote(IProposalOutcome.Pass).send()
    expect(voteResponse.result).toMatchObject({
      outcome : IProposalOutcome.Pass
    })

    let votes: Vote[] = []

    const voteIsIndexed = async () => {
      // we pass no-cache to make sure we hit the server on each request
      votes = await Vote.search({proposal: proposal.id}, arc, { fetchPolicy: 'no-cache' })
        .pipe(first()).toPromise()
      return votes.length > 0
    }
    await waitUntilTrue(voteIsIndexed)

    expect(votes.length).toEqual(1)
    const vote = votes[0]
    expect(vote.proposalId).toEqual(proposal.id)
    expect(vote.dao).toEqual(dao.address)
    expect(vote.outcome).toEqual(IProposalOutcome.Pass)
  })

  it('vote gets correctly indexed on the proposal entity', async () => {
    const proposal = await createAProposal()

    const voteHistory: Vote[][] = []
    Vote.search({proposal: proposal.id}, arc).subscribe((next: Vote[]) => {
      voteHistory.push(next)
    })
    const lastVotes = () => {
      if (voteHistory.length > 0) {
       return voteHistory[voteHistory.length - 1]
     } else {
       return []
     }
    }
    const vote = await proposal.vote(IProposalOutcome.Pass).send()
    await waitUntilTrue(() => {
      const ls = lastVotes()
      return ls.length > 0
    })
    const proposalVotes = await proposal.votes().pipe(first()).toPromise()
    expect(proposalVotes.length = 1)
    expect(proposalVotes[0].outcome).toEqual(IProposalOutcome.Pass)
  })

  it('throws a meaningful error if the proposal does not exist', async () => {
    // a non-existing proposal
    const proposal = new Proposal(
      '0x1aec6c8a3776b1eb867c68bccc2bf8b1178c47d7b6a5387cf958c7952da267c2', dao.address, arc
    )
    proposal.context.web3.eth.defaultAccount = arc.web3.eth.accounts.wallet[2].address
    await expect(proposal.vote(IProposalOutcome.Pass).send()).rejects.toThrow(
      /unknown proposal/i
    )
  })

  it.skip('handles the case of voting without reputation nicely', () => {
    // TODO: write this test!
  })
})
