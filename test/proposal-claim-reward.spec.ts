import { take } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { Proposal } from '../src/proposal'
import { fromWei, getArc, getTestDAO, toWei } from './utils'

describe('Claim rewards', () => {
  let arc: Arc

  beforeAll(async () => {
    arc = getArc()
  })

  it.skip('works ', async () => {
    const dao = await getTestDAO()
    const beneficiary = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'
    const ethReward = toWei("300")
    const prevethBalance = await arc.web3.eth.getBalance(beneficiary)
    const options = {
      beneficiary,
      ethReward,
      externalTokenAddress: undefined,
      externalTokenReward: toWei("0"),
      nativeTokenReward: toWei("1"),
      periodLength: 12,
      periods: 5,
      type: 'ContributionReward'
    }

    const response = await dao.createProposal(options).send()
    const proposal = response.result as Proposal

    await proposal.claimRewards(beneficiary).send()
    const newethBalance = await arc.web3.eth.getBalance(beneficiary)
    expect(fromWei(newethBalance.sub(prevethBalance))).toEqual('whatever-the-rewards are')
  })

})
