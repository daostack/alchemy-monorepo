import { Observable, Observer } from 'rxjs'

export enum TransactionState {
  Sent,
  Mined
}

/**
 * A transaction update is a snapshot of the state of a transaction at a particular time.
 */
export interface ITransactionUpdate<T> {
  state: TransactionState
  /**
   *  number of confirmations
   */
  transactionHash: string
  receipt?: object
  confirmations?: number
  /**
   * Parsed return value from the method call
   * or contract address in the case of contract creation tx.
   */
  result?: T
}

/**
 * An operation is a stream of transaction updates
 */
export type Operation<T> = Observable<ITransactionUpdate<T>>

type web3receipt = object

export function sendTransaction<T>(transaction: any, map: (receipt: web3receipt) => T): Operation<T> {
  try {
    const emitter = transaction.send()
    const observable = Observable.create((observer: Observer<ITransactionUpdate<T>>) => {
    let transactionHash: string
    let result: any
    emitter
      .once('transactionHash', (hash: string) => {
        transactionHash = hash
        observer.next({
          state: TransactionState.Sent,
          transactionHash
        })
      })
      .once('receipt', (receipt: any) => {
        try {
          result = map(receipt)
        } catch (err) {
          observer.error(err)
        }
        observer.next({
          confirmations: 0,
          receipt,
          result,
          state: TransactionState.Mined,
          transactionHash
        })
      })
      .on('confirmation', (confNumber: number, receipt: any) => {
        // we assume result has been set by previous call to 'receipt'
        if (!result) {
          try {
            result = map(receipt)
          } catch (err) {
            observer.error(err)
          }
        }
        observer.next({
          confirmations: confNumber,
          receipt,
          result,
          state: TransactionState.Mined,
          transactionHash
        })
        if (confNumber > 23) {
          // the web3 observer will confirm up to 24 subscriptions, so we are done here
          observer.complete()
        }
      })
      .on('error', (error: Error) => {
        console.log('ERROR HERE')
        observer.error(error)
      })
  })
    return observable
  } catch (error) {
    throw Error('my error')
  }
}
