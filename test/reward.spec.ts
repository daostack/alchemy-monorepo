import { first } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { IProposalType, Proposal } from '../src/proposal'
import { Reward } from '../src/reward'
import { getTestAddresses, getTestDAO, ITestAddresses, newArc, toWei } from './utils'

/**
 * Reward test
 */
describe('Reward', () => {

  let arc: Arc
  let testAddresses: ITestAddresses
  let dao: DAO

  beforeAll(async () => {
    arc = await newArc()
    testAddresses = getTestAddresses()
    dao = await getTestDAO()
  })

  it('Reward is instantiable', () => {
    const id = 'some-id'
    const reward = new Reward(id, arc)
    expect(reward).toBeInstanceOf(Reward)
  })

  it('Rewards are searchable', async () => {

    // create a proposal with some rewards
    const beneficiary = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'
    const state = await dao.createProposal({
      beneficiary,
      dao: dao.address,
      ethReward: toWei('300'),
      externalTokenAddress: undefined,
      externalTokenReward: toWei('0'),
      nativeTokenReward: toWei('1'),
      scheme: testAddresses.base.ContributionReward
    }).send()
    const proposal = state.result as Proposal

    expect(proposal).toBeDefined()

    let result
    result = await Reward.search(arc)
        .pipe(first()).toPromise()
    expect(result.length).toBeGreaterThan(0)
    //
    // result = await Reward.search({proposal: proposal.id}, arc)
    //     .pipe(first()).toPromise()
    // expect(result.length).toEqual(1)

    // search does not care about case in the address
    result = await Reward.search(arc, {beneficiary})
        .pipe(first()).toPromise()
    expect(result.length).toBeGreaterThan(0)

    result = await Reward.search(arc, {beneficiary: arc.web3.utils.toChecksumAddress(beneficiary)})
        .pipe(first()).toPromise()
    expect(result.length).toBeGreaterThan(0)

    expect(() => Reward.search(arc, {beneficiary: ''})).toThrowError(
      /not a valid address/i
    )

  })
})
