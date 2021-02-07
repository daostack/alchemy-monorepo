import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { IProposalOutcome} from '../src/proposal'
import { Vote } from '../src/vote'
import { createAProposal, getTestDAO, newArc, toWei, waitUntilTrue } from './utils'

jest.setTimeout(60000)

/**
 * Stake test
 */
describe('vote', () => {

  let arc: Arc

  beforeAll(async () => {
    arc = await newArc()
  })

  it('Vote is instantiable', () => {
    const vote = new Vote({
      amount: toWei('100'),
      createdAt: 0,
      id: '0x1234id',
      outcome: IProposalOutcome.Fail,
      proposal: '0x12445proposalId',
      voter: '0x124votes'
    }, arc)
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
      result = await Vote.search(arc, {where:  {proposal: proposal.id}}, { fetchPolicy: 'no-cache' })
        .pipe(first()).toPromise()
      return result.length > 0
    }
    await waitUntilTrue(voteIsIndexed)
    if (result) {
      expect(result.length).toEqual(1)
      expect((await result[0].fetchStaticState()).outcome).toEqual(IProposalOutcome.Pass)
    }
    const vote = result[0]

    result = await Vote.search(arc)
      .pipe(first()).toPromise()
    expect(Array.isArray(result)).toBe(true)

    result = await Vote.search(arc, {where: {proposal: '0x12345doesnotexist'}})
      .pipe(first()).toPromise()
    expect(result).toEqual([])

    result = await Vote.search(arc, {where:  {id: '0x12345doesnotexist'}})
      .pipe(first()).toPromise()
    expect(result).toEqual([])

    result = await Vote.search(arc, {where:  {id: vote.id}})
      .pipe(first()).toPromise()
    expect(result.length).toEqual(1)

    const voteState = await vote.fetchStaticState()
    result = await Vote.search(arc, {where: {id: vote.id, voter: arc.web3.utils.toChecksumAddress(voteState.voter)}})
      .pipe(first()).toPromise()
    expect(result.length).toEqual(1)
  })

  it('paging and sorting works', async () => {
    const ls1 = await Vote.search(arc, { first: 3, orderBy: 'voter' }).pipe(first()).toPromise()
    expect(ls1.length).toEqual(3)
    expect((await ls1[0].fetchStaticState()).voter <= (await ls1[1].fetchStaticState()).voter).toBeTruthy()

    const ls2 = await Vote.search(arc, { first: 2, skip: 2, orderBy: 'voter' }).pipe(first()).toPromise()
    expect(ls2.length).toEqual(2)
    expect((await ls1[2].fetchStaticState()).voter).toEqual((await ls2[0].fetchStaticState()).voter)

    const ls3 = await Vote.search(arc, {  orderBy: 'voter', orderDirection: 'desc'}).pipe(first()).toPromise()
    expect((await ls3[0].fetchStaticState()).voter <= (await ls3[1].fetchStaticState()).voter).toBeTruthy()
  })

})
