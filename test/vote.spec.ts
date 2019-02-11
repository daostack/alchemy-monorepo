import { first, take } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { ProposalOutcome} from '../src/proposal'
import { Vote } from '../src/vote'
import { createAProposal, getArc, getTestDAO, waitUntilTrue } from './utils'

/**
 * Stake test
 */
describe('Stake', () => {

  let arc: Arc

  beforeAll(() => {
    arc = getArc()
  })

  it('Vote is instantiable', () => {
    const vote = new Vote(
      '0x1234id',
      '0x124votes',
      0,
      ProposalOutcome.Fail,
      3e18,
      '0x12445proposalId',
      '0x12445daoAddress'
    )
    expect(vote).toBeInstanceOf(Vote)
  })

  it('Votes are searchable', async () => {

    let result: Vote[] = []
    const dao = await getTestDAO()
    const proposal = await createAProposal(dao)
    // let's have a vote
    await proposal.vote(ProposalOutcome.Pass).send()

    const voteIsIndexed = async () => {
      // we pass no-cache to make sure we hit the server on each request
      result = await Vote.search(arc, {proposal: proposal.id}, { fetchPolicy: 'no-cache' })
        .pipe(first()).toPromise()
      return result.length > 0
    }
    await waitUntilTrue(voteIsIndexed)
    if (result) {
      expect(result.length).toEqual(1)
      expect(result[0].outcome).toEqual(ProposalOutcome.Pass)
    }

    result = await Vote.search(arc, {})
      .pipe(first()).toPromise()
    expect(Array.isArray(result)).toBe(true)

    result = await Vote.search(arc, {proposal: '0x12345doesnotexist'})
      .pipe(first()).toPromise()
    expect(result).toEqual([])

    result = await Vote.search(arc, {id: '0x12345doesnotexist'})
      .pipe(first()).toPromise()
    expect(result).toEqual([])

    // TODO: find out why the test below fails with a timeout error
    // result = await Vote.search(arc, {
    //   dao: '0xsomedao',
    //   id: '0x12345doesnotexist'
    // }).pipe(first()).toPromise()
    // expect(result).toEqual([])
  })
})
