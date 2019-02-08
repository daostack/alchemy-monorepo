import { take } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { Proposal } from '../src/proposal'
import { getArc, getTestDAO } from './utils'

describe('Claim rewards', () => {
  let arc: Arc

  beforeAll(async () => {
    arc = getArc()
  })

  it.skip('works ', async () => {
    const dao = await getTestDAO()
    const beneficiary = '0xffcf8fdee72ac11b5c542428b35eef5769c409f0'
    const ethReward = 300
    const prevEthBalance = await arc.web3.eth.getBalance(beneficiary)
    const options = {
      beneficiary,
      ethReward,
      externalTokenAddress: undefined,
      externalTokenReward: 0,
      nativeTokenReward: 1,
      periodLength: 12,
      periods: 5,
      type: 'ContributionReward'
    }

    const response = await dao.createProposal(options).pipe(take(2)).toPromise()
    const proposal = response.result as Proposal

    await proposal.claimRewards(beneficiary).pipe(take(2)).toPromise()
    const newEthBalance = await arc.web3.eth.getBalance(beneficiary)
    expect(newEthBalance - prevEthBalance).toEqual('whatever-the-rewards are')
  })

})
