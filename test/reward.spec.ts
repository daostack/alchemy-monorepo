import { first, take } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { IProposalType, Proposal } from '../src/proposal'
import { Reward } from '../src/reward'
import { getTestDAO, newArc, toWei } from './utils'

/**
 * Reward test
 */
describe('Reward', () => {

  let arc: Arc

  beforeAll(() => {
    arc = newArc()
  })

  it('Reward is instantiable', () => {
    const id = 'some-id'
    const reward = new Reward(id, arc)
    expect(reward).toBeInstanceOf(Reward)
  })

  it('Rewards are searchable', async () => {

    // create a proposal with some rewards
    const dao = await getTestDAO()
    const beneficiary = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'
    const state = await dao.createProposal({
      beneficiary,
      ethReward: toWei('300'),
      externalTokenAddress: undefined,
      externalTokenReward: toWei('0'),
      nativeTokenReward: toWei('1'),
      periodLength: 12,
      periods: 5,
      type: IProposalType.ContributionReward
    }).send()
    const proposal = state.result as Proposal

    expect(proposal).toBeDefined()

    let result
    result = await Reward.search({}, arc)
        .pipe(first()).toPromise()
    expect(result.length).toBeGreaterThan(0)
    //
    // result = await Reward.search({proposal: proposal.id}, arc)
    //     .pipe(first()).toPromise()
    // expect(result.length).toEqual(1)

    // search does not care about case in the address
    result = await Reward.search({beneficiary}, arc)
        .pipe(first()).toPromise()
    expect(result.length).toBeGreaterThan(0)

    result = await Reward.search({beneficiary: arc.web3.utils.toChecksumAddress(beneficiary)}, arc)
        .pipe(first()).toPromise()
    expect(result.length).toBeGreaterThan(0)

    expect(() => Reward.search({beneficiary: null}, arc)).toThrowError(
      /not a valid address/i
    )

  })
})
