import { getArc } from './utils'
import { DAO } from '../src/dao'
import { Arc } from '../src/arc'

describe('ContributionReward', () => {
  let arc: Arc
  let web3: any
  let accounts: any

  beforeAll(async () => {
    arc = getArc()
    web3 = arc.web3
    accounts = web3.eth.accounts.wallet
    web3.eth.defaultAccount = accounts[0].address
  });

  it('Sanity', async () => {
    const dao = new DAO(arc.contractAddresses.Avatar, arc)
    const options = {
      beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
      ethReward: 4,
      externalTokenReward: 0,
      nativeTokenReward: 1,
      periodLength: 12,
      periods: 5,
      externalTokenAddress: undefined
    }
    const result = await dao.createProposal(options)
    expect(result.proposalId).toHaveLength(66)
    expect(result.proposalId).toMatch(/^0x/)
  })
})
