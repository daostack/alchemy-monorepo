import { reduce, take } from 'rxjs/operators'
import { ITransactionUpdate, TransactionState } from '../src/operation'
import { Proposal } from '../src/proposal'
import { getTestDAO, mineANewBlock } from './utils'

jest.setTimeout(10000)

describe('Operation', () => {

  it('returns the correct sequence of states', async () => {
    const dao = await getTestDAO()
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

    // collect the first 4 results of the observable in a a listOfUpdates array
    const promises: Array<Promise<any>> = []
    const listOfUpdates = await dao.createProposal(options)
      .pipe(
        take(4),
        reduce((acc: Array<ITransactionUpdate<Proposal>> , val: ITransactionUpdate<Proposal>) => {
          // mine a new block so we will receive a new confirmation
          promises.push(mineANewBlock())
          acc.push(val); return acc
        }, [])
      )
      .toPromise()

    // wait for all blocks mined in the reduce step
    await Promise.all(promises)

    // the first returned value is expected to be the "sent" (i.e. not mined yet)
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

    expect( listOfUpdates[1].result ).toBeInstanceOf(Proposal)

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
