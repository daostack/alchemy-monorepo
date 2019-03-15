import { first} from 'rxjs/operators'
import { Arc } from '../src/arc'
import { IProposalOutcome} from '../src/proposal'
import { Stake } from '../src/stake'
import { createAProposal, getArc, toWei, waitUntilTrue } from './utils'

/**
 * Stake test
 */
describe('Stake', () => {

  let arc: Arc

  beforeAll(() => {
    arc = getArc()
  })

  it('Stake is instantiable', () => {
    const stake = new Stake('0x1234id', '0x124staker', new Date(),
      IProposalOutcome.Fail, toWei('300'), '0x12445proposalId')
    expect(stake).toBeInstanceOf(Stake)
  })

  it('Stakes are searchable', async () => {
    let result
    const proposal = await createAProposal()
    const stakes: any[] = []
    proposal.stakes().subscribe((next) => stakes.push(next))

    const stakeAmount = toWei('18')
    await proposal.stakingToken().mint(arc.web3.eth.defaultAccount, stakeAmount).send()
    await arc.approveForStaking(stakeAmount).send()
    await proposal.stake(IProposalOutcome.Pass, stakeAmount).send()

    // wait until we have the we received the stake update
    await waitUntilTrue(() => stakes.length > 0 && stakes[stakes.length - 1].length > 0)

    const stake = stakes[stakes.length - 1][0]

    // search for a stakes in an invalid proposal
    result = await Stake.search({proposal: '0x12345'}, arc)
      .pipe(first()).toPromise()
    expect(result).toEqual([])

    result = await Stake.search({proposal: proposal.id}, arc)
      .pipe(first()).toPromise()
    expect(result.length).toEqual(1)
    expect(result[0].outcome).toEqual(IProposalOutcome.Pass)

    result = await Stake
      .search({staker: stake.staker, proposal: proposal.id}, arc)
      .pipe(first()).toPromise()
    expect(result.length).toEqual(1)

    result = await Stake
      .search({staker: arc.web3.utils.toChecksumAddress(stake.staker), proposal: proposal.id}, arc)
      .pipe(first()).toPromise()
    expect(result.length).toEqual(1)
  })

})
