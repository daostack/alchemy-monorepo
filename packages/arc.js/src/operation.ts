import { Observable, Observer } from 'rxjs'
import { first, take } from 'rxjs/operators'
import { Arc } from './arc'
import { Logger } from './logger'
import { Web3Receipt } from './types'

export enum ITransactionState {
  Sending,
  Sent,
  Mined
}

/**
 * A transaction update is a snapshot of the state of a transaction at a particular time.
 */
export interface ITransactionUpdate<T> {
  state: ITransactionState
  transactionHash?: string
  receipt?: object
  /**
   *  number of confirmations
   */
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
export interface IOperationObservable<T> extends Observable<T> {
  send: () => Promise<Web3Receipt>
}

export type Operation<T> = IOperationObservable<ITransactionUpdate<T>>

export type web3receipt = object

export type transactionErrorHandler =  (
  error: Error, transaction?: any, options?: { from?: string}) => Promise<Error> | Error

/**
 *
 *  * send a transaction to the ethereumblockchain, and return a observable of ITransactionUpdatessend
 * for example:
 *  ```sendTransaction(.....).subscribe((txUpdate) => {
 *    if (txUpdate.state === 'sent' ) { notify("your transaction has been sent, waitin'for it to be mnied") }
 *    if (txUpdate.state === 'mined'} {
 *      notify("your transaction has been mined! It was confirmed ${txUpdate.confirmations} times"}
 *      // and we also ahve the txUpdate.receipt and the txUpdate.result to do stuff with
 *    }
 *  })```
 *
 * @export
 * @template T
 * @param {Arc} context An instance of Arc
 * @param {*} transaction A Web3 transaction object to send
 * @param {((receipt: web3receipt) => T | Promise<T>)} mapReceipt A function that takes the receipt of
 *  the transaction and returns an object
 * @param {((error: Error, transaction: any, options: { from?: string }) => Promise<Error> | Error)} [errorHandler]
 *  A function that takes an error, and either returns or throws a more informative Error
 *  if errorHander is not provided, a default error handler will throw any errors thrown by calling `transaction.call()`
 * @returns {Operation<T>}
 */
export function sendTransaction<T>(
  context: Arc,
  transaction: any,
  mapReceipt: (receipt: web3receipt) => T | Promise<T>,
  errorHandler: transactionErrorHandler = async (err: Error, tx: any = transaction, options: { from?: string} = {}) => {
      await tx.call(options)
      throw err
    }
): Operation<T> {

  const observable = Observable.create(async (observer: Observer<ITransactionUpdate<T>>) => {
    let transactionHash: string
    let result: any
    let tx: any
    if (typeof transaction === 'function') {
      try {
        tx = await transaction()
      } catch (err) {
        observer.error(err)
      }
    } else {
      tx = transaction
    }

    const from = await context.getAccount().pipe(first()).toPromise()

    let gasEstimate: number = 0
    try {
      gasEstimate = await tx.estimateGas({ from })
    } catch (error) {
      try {
        error = await errorHandler(error, transaction, {from})
      } catch (err) {
        error = err
      }
      observer.error(error)
      return
    }
    let gas: number
    if (gasEstimate) {
      gas = gasEstimate * 2
    } else {
      gas = 1000000
    }
    gas = Math.min(1000000, gas)
    // gas = new BN(1000000)
    const options = {
      from,
      gas
    }
    observer.next({
      state: ITransactionState.Sending
    })
    /**
     * Keep our own count here because ganache and infura are not consistent in how they count the
     * confirmatipn events.  Sometimes a confirmation event can appear before the receipt event.
     * Infura tends to start the confirmation count at 0, whereas ganache (in the test env) likes to start it at 1.
     * A consequence of the latter is that when we hit 24 events, there may or may not have been 24 actual minings --
     * we may have incorrectly counted the "receipt" event as a confirmation.
     */
    let confirmationCount = 0
    tx.send(options)
      .once('transactionHash', (hash: string) => {
        Logger.debug('Sending transaction..')
        transactionHash = hash
        observer.next({
          state: ITransactionState.Sent,
          transactionHash
        })
      })
      .once('receipt', async (receipt: any) => {
        try {
          result = await mapReceipt(receipt)
        } catch (error) {
          try {
            error = await (errorHandler as (error: Error) => Promise<Error> | Error)(error)
          } catch (err) {
            error = err
          }
          observer.error(error)
        }
        if (confirmationCount === 0) {
          Logger.debug(`transaction mined!`)
        }
        observer.next({
          confirmations: confirmationCount++,
          receipt,
          result,
          state: ITransactionState.Mined,
          transactionHash
        })
      })
      .on('confirmation', async (confNumber: number, receipt: any) => {
        if (!result) {
          try {
            result = await mapReceipt(receipt)
          } catch (error) {
            try {
              error = await (errorHandler as (error: Error) => Promise<Error> | Error)(error)
            } catch (err) {
              error = err
            }
            observer.error(error)
          }
        }
        if (confirmationCount === 0) {
          Logger.debug(`transaction mined!`)
        }
        observer.next({
          confirmations: confirmationCount++,
          receipt,
          result,
          state: ITransactionState.Mined,
          transactionHash
        })
        if (confirmationCount > 23) {
          // the web3 observer will confirm up to 24 subscriptions, so we are done here
          observer.complete()
        }
      })
      .on('error', async (error: Error) => {
        try {
          error = await (errorHandler as (error: Error) => Promise<Error> | Error)(error)
        } catch (err) {
          error = err
        }
        observer.error(error)
      })
  }
  )
  return toIOperationObservable(observable)
}

export function toIOperationObservable<T>(observable: Observable<T>): IOperationObservable<T> {

  // the 3rd update we get from the observable is the confirmation that it is mined
  // @ts-ignore
  observable.send = () => observable.pipe(take(3)).toPromise()
  // @ts-ignore
  return observable
}
