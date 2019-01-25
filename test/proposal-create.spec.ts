import { first, reduce, take } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { ITransactionUpdate, TransactionState } from '../src/operation'
import { Proposal } from '../src/proposal'
import { getArc, mineANewBlock, waitUntilTrue } from './utils'

describe('Create a ContributionReward proposal', () => {
  let arc: Arc
  let web3: any
  let accounts: any

  beforeAll(async () => {
    arc = getArc()
    web3 = arc.web3
    accounts = web3.eth.accounts.wallet
    web3.eth.defaultAccount = accounts[0].address
  })

  it('is properly indexed', async () => {
    const dao = new DAO(arc.contractAddresses.dao.Avatar, arc)
    const options = {
      beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
      ethReward: 300,
      externalTokenAddress: undefined,
      externalTokenReward: 0,
      nativeTokenReward: 1,
      periodLength: 12,
      periods: 5,
      type: 'ContributionReward'
    }

    const response = await dao.createProposal(options).pipe(take(2)).toPromise()
    const proposal = response.result as Proposal
    let proposals: Proposal[] = []
    const proposalIsIndexed = async () => {
      // we pass no-cache to make sure we hit the server on each request
      proposals = await Proposal.search({id: proposal.id}, arc, { fetchPolicy: 'no-cache' })
        .pipe(first()).toPromise()
      return proposals.length > 0
    }
    await waitUntilTrue(proposalIsIndexed)

    expect(proposal.id).toBeDefined()
    // TODO: if we use the existing "proposal" and get its state, I get an "proposal
    // with this id does not exist". How is that possible?
    const proposal2 = new Proposal(proposal.id, proposal.dao.address, arc)
    const proposalState = await proposal2.state.pipe(first()).toPromise()
    expect(proposalState).toMatchObject({
      beneficiary: options.beneficiary
    })

  })
})
