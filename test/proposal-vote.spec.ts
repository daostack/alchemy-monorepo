import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { IProposalOutcome, Proposal } from '../src/proposal'
import { Vote } from '../src/vote'
import { createAProposal, newArc, getTestDAO, waitUntilTrue } from './utils'

describe('Vote on a ContributionReward', () => {
  let arc: Arc
  let dao: DAO

  beforeAll(async () => {
    arc = newArc()
    dao = await getTestDAO()
  })

  it.skip('works and gets indexed', async () => {
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
    expect(vote.proposalId).toBe(proposal.id)
    expect(vote.dao).toEqual(dao.address)
  })

  it.skip('vote gets correctly indexed on the proposal entity', async () => {
    const proposal = await createAProposal()
    await proposal.vote(IProposalOutcome.Pass).send()

    let votes: Vote[] = []
    const voteIsIndexed = async () => {
      // we pass no-cache to make sure we hit the server on each request
      votes = await Vote.search({proposal: proposal.id}, arc,  { fetchPolicy: 'no-cache' })
        .pipe(first()).toPromise()
      return votes.length > 0
    }
    await waitUntilTrue(voteIsIndexed)

    const proposalState = await proposal.state().pipe(first()).toPromise()
    const proposalState2 = await (new Proposal(proposal.id, dao.address, arc)).state().pipe(first()).toPromise()

    expect(proposalState).toEqual(proposalState2)
    expect(proposalState).toEqual('xxx')
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
  it.skip('can vote with accounts[1]', () => {
    // TODO: write this test!
  })
})
