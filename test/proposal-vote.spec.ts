import { first, take } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { Proposal, ProposalOutcome } from '../src/proposal'
import { Vote } from '../src/vote'
import { getArc, waitUntilTrue } from './utils'

describe('Vote on a ContributionReward', () => {
  let arc: Arc
  let web3: any
  let accounts: any

  beforeAll(async () => {
    arc = getArc()
    web3 = arc.web3
    accounts = web3.eth.accounts.wallet
    web3.eth.defaultAccount = accounts[0].address
  })

  it('works and gets indexed', async () => {
    const dao = new DAO(arc.contractAddresses.dao.Avatar, arc)
    const options = {
      beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
      ethReward: 300,
      externalTokenAddress: undefined,
      externalTokenReward: 0,
      nativeTokenReward: 1,
      periodLength: 12,
      periods: 5,
      type: 'ConributionReward'
    }

    // collect the first 4 results of the observable in a a listOfUpdates array
    const response = await dao.createProposal(options).pipe(take(2)).toPromise()
    const proposal = response.result as Proposal
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
