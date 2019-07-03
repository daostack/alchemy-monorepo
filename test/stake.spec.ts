import { first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { IProposalOutcome} from '../src/proposal'
import { Stake } from '../src/stake'
import { createAProposal, newArc, toWei, waitUntilTrue } from './utils'

jest.setTimeout(20000)

/**
 * Stake test
 */
describe('Stake', () => {

  let arc: Arc

  beforeAll(async () => {
    arc = await newArc()
  })

  it('Stake is instantiable', () => {
    const stake = new Stake('0x1234id', '0x124staker', new Date(),
      IProposalOutcome.Fail, toWei('300'), '0x12445proposalId')
    expect(stake).toBeInstanceOf(Stake)
  })

  it('Stakes are searchable', async () => {
    let result: any
    const proposal = await createAProposal()
    const stakes: any[] = []

    const stakeAmount = toWei('18')
    await proposal.stakingToken().mint(arc.web3.eth.defaultAccount, stakeAmount).send()
    await arc.approveForStaking(proposal.votingMachine().options.address, stakeAmount).send()

    proposal.stakes().subscribe((next) => stakes.push(next))
    await proposal.stake(IProposalOutcome.Pass, stakeAmount).send()

    // wait until we have the we received the stake update
    await waitUntilTrue(() => stakes.length > 0 && stakes[stakes.length - 1].length > 0)

    const stake = stakes[stakes.length - 1][0]

    // search for a stakes in an invalid proposal
    result = await Stake.search(arc, {where: {proposal: '0x12345'}})
      .pipe(first()).toPromise()
    expect(result).toEqual([])

    result = await Stake.search(arc, {where:  {proposal: proposal.id}})
      .pipe(first()).toPromise()
    expect(result.length).toEqual(1)
    expect(result[0].outcome).toEqual(IProposalOutcome.Pass)

    result = await Stake
      .search(arc, {where: {staker: stake.staker, proposal: proposal.id}})
      .pipe(first()).toPromise()
    expect(result.length).toEqual(1)

    result = await Stake
      .search(arc, {where:  {staker: arc.web3.utils.toChecksumAddress(stake.staker), proposal: proposal.id}})
      .pipe(first()).toPromise()
    expect(result.length).toEqual(1)
  })

  it('paging and sorting works', async () => {
    const ls1 = await Stake.search(arc, { first: 3, orderBy: 'id' }).pipe(first()).toPromise()
    expect(ls1.length).toEqual(3)
    expect(Number(ls1[0].id)).toBeLessThan(Number(ls1[1].id))

    const ls2 = await Stake.search(arc, { first: 2, skip: 2, orderBy: 'id' }).pipe(first()).toPromise()
    expect(ls2.length).toEqual(2)
    expect(Number(ls1[2].id)).toEqual(Number(ls2[0].id))

    const ls3 = await Stake.search(arc, {  orderBy: 'id', orderDirection: 'desc'}).pipe(first()).toPromise()
    expect(Number(ls3[0].id)).toBeGreaterThanOrEqual(Number(ls3[1].id))
  })

})
