import { ITransactionUpdate, ITransactionState } from '../src/operation'
import { Proposal } from '../src/proposal'
import { getArc, getTestDAO, mineANewBlock, toWei, waitUntilTrue } from './utils'

jest.setTimeout(10000)

describe('Operation', () => {

  it('returns the correct sequence of states', async () => {
    const dao = await getTestDAO()
    const arc = await getArc()
    const options = {
      beneficiary: '0xffcf8fdee72ac11b5c542428b35eef5769c409f0',
      ethReward: toWei("300"),
      externalTokenAddress: undefined,
      externalTokenReward: toWei("0"),
      nativeTokenReward: toWei("1"),
      periodLength: 12,
      periods: 5,
      type: 'ConributionReward'
    }

    // collect the first 4 results of the observable in a a listOfUpdates array
    const listOfUpdates: Array<ITransactionUpdate<Proposal>> = []
    dao.createProposal(options).subscribe(
      (next) => { listOfUpdates.push(next) }
    )

    // wait for the transaction to be mined
    // (we expect first a 'transaction sent' update, then the 0 confirmation)
    await waitUntilTrue(() => listOfUpdates.length === 2)

    // wait for all blocks mined in the reduce step
    for (let i = 0; i < 4; i++) {
      await mineANewBlock()
    }
    // wait forl all pdates
    await waitUntilTrue(() => listOfUpdates.length > 3)

    // the first returned value is expected to be the "sent" (i.e. not mined yet)
    expect(listOfUpdates[0]).toMatchObject({
      state: ITransactionState.Sent
    })
    expect(listOfUpdates[1]).toMatchObject({
      confirmations: 0,
      state: ITransactionState.Mined
    })
    expect(listOfUpdates[1].result).toBeDefined()
    expect(listOfUpdates[1].receipt).toBeDefined()
    expect(listOfUpdates[1].transactionHash).toBeDefined()

    expect( listOfUpdates[1].result ).toBeInstanceOf(Proposal)

    expect(listOfUpdates[2]).toMatchObject({
      confirmations: 1,
      state: ITransactionState.Mined
    })
    expect(listOfUpdates[3]).toMatchObject({
      confirmations: 2,
      receipt: listOfUpdates[1].receipt,
      // result: listOfUpdates[1].result,
      state: ITransactionState.Mined,
      transactionHash: listOfUpdates[1].transactionHash
    })

  })
})
