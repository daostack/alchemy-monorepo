import { first, take } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { Reward } from '../src/reward'
import { getArc, getTestDAO, toWei } from './utils'

/**
 * Reward test
 */
describe('Reward', () => {

  let arc: Arc

  beforeAll(() => {
    arc = getArc()
  })

  it('Reward is instantiable', () => {
    const id = 'some-id'
    const reward = new Reward(id, arc)
    expect(reward).toBeInstanceOf(Reward)
  })

  it('Rewards are searchable', async () => {

    // create a proposal with some rewards
    const dao = await getTestDAO()
    const state = await dao.createProposal({
          beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
          ethReward: toWei("300"),
          externalTokenAddress: undefined,
          externalTokenReward: toWei("0"),
          nativeTokenReward: toWei("1"),
          periodLength: 12,
          periods: 5,
          type: 'ContributionReward'
    }).send()
    const proposal = state.result

    expect(proposal).toBeDefined()

    // "if" clause to keep type checker happy
    if (proposal) {
      let result
      result = await Reward.search(arc, {})
        .pipe(first()).toPromise()
      expect(result).toEqual([])

      result = await Reward.search(arc, {proposal: proposal.id})
        .pipe(first()).toPromise()
      expect(result).toEqual([])
    }
  })
})
