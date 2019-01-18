import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { ITransactionUpdate, TransactionState } from '../src/operation'
import { Proposal } from '../src/proposal'
import { getArc, waitUntilTrue } from './utils'

describe('Create ContributionReward Proposal', () => {
  let arc: Arc
  let web3: any
  let accounts: any

  beforeAll(async () => {
    arc = getArc()
    web3 = arc.web3
    accounts = web3.eth.accounts.wallet
    web3.eth.defaultAccount = accounts[0].address
  })

  it('Sanity', async () => {
    const dao = new DAO(arc.contractAddresses.Avatar, arc)
    const options = {
      beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
      ethReward: 300,
      externalTokenAddress: undefined,
      externalTokenReward: 0,
      nativeTokenReward: 1,
      periodLength: 12,
      periods: 5,
      type: 'ConributionReward'
    }
    let latestUpdate: ITransactionUpdate<Proposal>
    const listOfUpdates: Array<ITransactionUpdate<Proposal>> = []
    const subscription =  dao.createProposal(options).subscribe(
      (data: any) => {
        // Do something on receipt of the event
        latestUpdate = data
        listOfUpdates.push(latestUpdate)
      },
      (err: any) => {
        throw err
      }
    )

    // wait for 4 confirmations
    await waitUntilTrue(() => {
      const confirmations = latestUpdate && latestUpdate.confirmations && latestUpdate.confirmations || 0
      return Boolean(confirmations > 3)
    })
    subscription.unsubscribe()

    // the first returned value is expected to be the "sent" thing
    expect(listOfUpdates[0]).toMatchObject({
      state: TransactionState.Sent
    })
    expect(listOfUpdates[1]).toMatchObject({
      confirmations: 0,
      state: TransactionState.Mined
    })
    expect(listOfUpdates[1].result).toBeDefined()
    expect(listOfUpdates[1].receipt).toBeDefined()
    expect(listOfUpdates[1].transactionHash).toBeDefined()

    const proposal = listOfUpdates[1].result
    if (proposal) {
      expect(proposal.id).toBeDefined()
    }

    expect(listOfUpdates[2]).toMatchObject({
      confirmations: 1,
      state: TransactionState.Mined
    })
    expect(listOfUpdates[3]).toMatchObject({
      confirmations: 2,
      receipt: listOfUpdates[1].receipt,
      // result: listOfUpdates[1].result,
      state: TransactionState.Mined,
      transactionHash: listOfUpdates[1].transactionHash
    })

  })
})
