import { first, take } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { ProposalOutcome } from '../src/proposal'
import { Vote } from '../src/vote'
import { createAProposal, getArc, waitUntilTrue } from './utils'

describe('Vote on a ContributionReward', () => {
  let arc: Arc

  beforeAll(async () => {
    arc = getArc()
  })

  it('works and gets indexed', async () => {
    const proposal = await createAProposal()

    const voteResponse = await proposal.vote(ProposalOutcome.Pass).pipe(take(2)).toPromise()
    expect(voteResponse.result).toMatchObject({
      outcome : ProposalOutcome.Pass
    })

    let votes: Vote[] = []

    const voteIsIndexed = async () => {
      // we pass no-cache to make sure we hit the server on each request
      votes = await Vote.search(arc, {proposal: proposal.id}, { fetchPolicy: 'no-cache' })
        .pipe(first()).toPromise()
      return votes.length > 0
    }
    await waitUntilTrue(voteIsIndexed)

    expect(votes.length).toEqual(1)

  })
})
