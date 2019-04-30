import BN = require('bn.js')
import { Arc } from '../src/arc'
import { Proposal } from '../src/proposal'
import { createAProposal, getTestDAO, newArc, toWei } from './utils'

describe('Claim rewards', () => {
  let arc: Arc

  beforeAll(async () => {
    arc = await newArc()
  })

  it('works ', async () => {
    const dao = await getTestDAO()
    const beneficiary = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'
    const ethReward = toWei('300')
    const prevethBalance = new BN(await arc.web3.eth.getBalance(beneficiary))
    const options = {
      beneficiary,
      ethReward,
      externalTokenAddress: undefined,
      externalTokenReward: toWei('0'),
      nativeTokenReward: toWei('1'),
      periodLength: 12,
      periods: 5,
      type: 'ContributionReward'
    }

    const response = await dao.createProposal(options).send()
    const proposal = response.result as Proposal

    await proposal.claimRewards(beneficiary).send()
    const newethBalance = new BN(await arc.web3.eth.getBalance(beneficiary))
    // no rewards were claimable yet
    expect(newethBalance.sub(prevethBalance).toNumber()).toEqual(0)

    // TODO: continue this test with an actually executed proposal

  })
  it('claimRewards should also work without providing a "beneficiary" argument', async () => {
    const proposal: Proposal = await createAProposal()
    await proposal.claimRewards().send()
  })

})
