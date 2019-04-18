import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { IProposalOutcome} from '../src/proposal'
import { Vote } from '../src/vote'
import { createAProposal, getTestDAO, newArc, toWei, waitUntilTrue } from './utils'

jest.setTimeout(10000)

/**
 * Stake test
 */
describe('vote', () => {

  let arc: Arc

  beforeAll(() => {
    arc = newArc()
  })

  it('Vote is instantiable', () => {
    const vote = new Vote(
      '0x1234id',
      '0x124votes',
      0,
      IProposalOutcome.Fail,
      toWei('100'),
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
    await proposal.vote(IProposalOutcome.Pass).send()

    const voteIsIndexed = async () => {
      // we pass no-cache to make sure we hit the server on each request
      result = await Vote.search({proposal: proposal.id}, arc, { fetchPolicy: 'no-cache' })
        .pipe(first()).toPromise()
      return result.length > 0
    }
    await waitUntilTrue(voteIsIndexed)
    if (result) {
      expect(result.length).toEqual(1)
      expect(result[0].outcome).toEqual(IProposalOutcome.Pass)
    }
    const vote = result[0]

    result = await Vote.search({}, arc)
      .pipe(first()).toPromise()
    expect(Array.isArray(result)).toBe(true)

    result = await Vote.search({proposal: '0x12345doesnotexist'}, arc)
      .pipe(first()).toPromise()
    expect(result).toEqual([])

    result = await Vote.search({id: '0x12345doesnotexist'}, arc)
      .pipe(first()).toPromise()
    expect(result).toEqual([])

    result = await Vote.search({id: vote.id}, arc)
      .pipe(first()).toPromise()
    expect(result.length).toEqual(1)

    result = await Vote.search({id: vote.id, voter: arc.web3.utils.toChecksumAddress(vote.voter)}, arc)
      .pipe(first()).toPromise()
    expect(result.length).toEqual(1)

    // TODO: find out why the test below fails with a timeout error
    // result = await Vote.search(arc, {
    //   dao: '0xsomedao',
    //   id: '0x12345doesnotexist'
    // }).pipe(first()).toPromise()
    // expect(result).toEqual([])
  })
})
