import { ITransactionState, ITransactionUpdate } from '../src/operation'
import { IProposalType, Proposal } from '../src/proposal'
import { getTestDAO, mineANewBlock, newArc, toWei, waitUntilTrue } from './utils'

jest.setTimeout(10000)

describe('Operation', () => {

  it('returns the correct sequence of states', async () => {
    const dao = await getTestDAO()
    const options = {
      beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
      ethReward: toWei('300'),
      externalTokenAddress: undefined,
      externalTokenReward: toWei('0'),
      nativeTokenReward: toWei('1'),
      type: IProposalType.ContributionReward
    }

    // collect the first 4 results of the observable in a a listOfUpdates array
    const listOfUpdates: Array<ITransactionUpdate<Proposal>> = []
    dao.createProposal(options).subscribe(
      (next: ITransactionUpdate<Proposal>) => { listOfUpdates.push(next) }
    )

    // wait for the transaction to be mined
    // (we expect first a
    // 1 'transaction sending' update
    // 2 'transaction sent' update,
    // 3. then the 0 confirmation)
    await waitUntilTrue(() => listOfUpdates.length === 3)

    // wait for all blocks mined in the reduce step
    for (let i = 0; i < 4; i++) {
      await mineANewBlock()
    }
    // wait forl all pdates
    await waitUntilTrue(() => listOfUpdates.length > 4)

    // the first returned value is expected to be the "sent" (i.e. not mined yet)
    expect(listOfUpdates[0]).toMatchObject({
      state: ITransactionState.Sending
    })
    expect(listOfUpdates[1]).toMatchObject({
      state: ITransactionState.Sent
    })
    expect(listOfUpdates[2]).toMatchObject({
      confirmations: 0,
      state: ITransactionState.Mined
    })
    expect(listOfUpdates[2].result).toBeDefined()
    expect(listOfUpdates[2].receipt).toBeDefined()
    expect(listOfUpdates[2].transactionHash).toBeDefined()

    expect( listOfUpdates[2].result ).toBeInstanceOf(Proposal)

    expect(listOfUpdates[3]).toMatchObject({
      confirmations: 1,
      state: ITransactionState.Mined
    })
    expect(listOfUpdates[4]).toMatchObject({
      confirmations: 2,
      receipt: listOfUpdates[2].receipt,
      state: ITransactionState.Mined,
      transactionHash: listOfUpdates[2].transactionHash
    })

  }, 20000)
})
