import { reduce, take } from 'rxjs/operators'
import { Arc } from '../src/arc'
import { DAO } from '../src/dao'
import { ITransactionUpdate, TransactionState } from '../src/operation'
import { IProposalCreateOptions, Proposal } from '../src/proposal'
import { getArc, getWeb3, mintSomeReputation, nullAddress } from './utils'

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
      dao: dao.address,
      ethReward: 300,
      externalTokenAddress: undefined,
      externalTokenReward: 0,
      nativeTokenReward: 1,
      periodLength: 12,
      periods: 5,
      type: 'ConributionReward'
    } as IProposalCreateOptions
    const context = arc

    const xxx = await arc.web3.eth.getBalance(arc.web3.eth.defaultAccount)
    console.log(xxx)

    const web3x = await getWeb3()
    await web3x.eth.sendTransaction({
      data: '0xABCD',
      from: accounts[0].address,
      gas: 2000000,
      to: dao.address,
      value: 1
    })

    // await mintSomeReputation()

    return

    const contributionReward = context.getContract('ContributionReward')

    const propose = contributionReward.methods.proposeContributionReward(
        options.dao,
        // TODO: after upgrading arc, use empty string as default value for descriptionHash
        options.descriptionHash || '0x0000000000000000000000000000000000000000000000000000000000000000',
        options.reputationReward || 0,
        [
          options.nativeTokenReward || 0,
          options.ethReward || 0,
          options.externalTokenReward || 0,
          // TODO: what are decent default values for periodLength and periods?
          options.periodLength || 0,
          options.periods || 0
        ],
        options.externalTokenAddress || nullAddress,
        options.beneficiary
    )

    await propose.send()
    return
    //
    // // collect the first 4 results of the observable in a a listOfUpdates array
    // const listOfUpdates = await dao.createProposal(options)
    //   .pipe(
    //     take(5),
    //     reduce((acc: Array<ITransactionUpdate<Proposal>> , val: ITransactionUpdate<Proposal>) => {
    //       acc.push(val); return acc
    //     }, [])
    //   )
    //   .toPromise()
    //
    // // the first returned value is expected to be the "sent" (i.e. not mined yet)
    // expect(listOfUpdates[0]).toMatchObject({
    //   state: TransactionState.Sent
    // })
    // expect(listOfUpdates[1]).toMatchObject({
    //   confirmations: 0,
    //   state: TransactionState.Mined
    // })
    // expect(listOfUpdates[1].result).toBeDefined()
    // expect(listOfUpdates[1].receipt).toBeDefined()
    // expect(listOfUpdates[1].transactionHash).toBeDefined()
    //
    // const proposal = listOfUpdates[1].result
    // if (proposal) {
    //   expect(proposal.id).toBeDefined()
    // }
    //
    // expect(listOfUpdates[2]).toMatchObject({
    //   confirmations: 1,
    //   state: TransactionState.Mined
    // })
    // expect(listOfUpdates[3]).toMatchObject({
    //   confirmations: 2,
    //   receipt: listOfUpdates[1].receipt,
    //   // result: listOfUpdates[1].result,
    //   state: TransactionState.Mined,
    //   transactionHash: listOfUpdates[1].transactionHash
    // })

  })
})
