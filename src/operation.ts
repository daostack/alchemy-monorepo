import { Observable, Observer } from 'rxjs'
import { first, take } from 'rxjs/operators'
import { Arc } from './arc'
import { Logger } from './logger'
import { Web3Receipt } from './types'

export enum ITransactionState {
  Sent,
  Mined
}

/**
 * A transaction update is a snapshot of the state of a transaction at a particular time.
 */
export interface ITransactionUpdate<T> {
  state: ITransactionState
  transactionHash: string
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

/**
 * send a transaction to the ethereumblockchain, and return a observable of ITransactionUpdatessend
 * for example:
 *  sendTransaction(.....).subscribe((txUpdate) => {
 *    if (txUpdate.state === 'sent' ) { notify("your transaction has been sent, waitin'for it to be mnied") }
 *    if (txUpdate.state === 'mined'} {
 *      notify("your transaction has been mined! It was confirmed ${txUpdate.confirmations} times"}
 *      // and we also ahve the txUpdate.receipt and the txUpdate.result to do stuff with
 *    }
 *  })
 *
 * @parameter transaction A web3 transaction, or an (async) function that returns a transaction
 * @parameter map A function that takes the receipt of the transaction and returns an object
 * @parameter errorHandler A function that takes an error, and either returns or throws a more informative Error
 * @parameter context An instance of Arc
 * @return An observable with ITransactionUpdate instnces
 */
export function sendTransaction<T>(
  transaction: any,
  map: (receipt: web3receipt) => T,
  errorHandler: (error: Error) => Promise<Error> | Error = (error) => error,
  context: Arc
): Operation<T> {
  const observable = Observable.create(async (observer: Observer<ITransactionUpdate<T>>) => {
    let transactionHash: string
    let result: any
    let tx
    if (typeof transaction === 'function') {
      tx = await transaction()
    }  else {
      tx = transaction
    }

    const from = await context.getAccount().pipe(first()).toPromise()
    const gasEstimate = tx.estimateGas()
    const options = {
      from,
      gas: gasEstimate * 1.1
    }
    const emitter = tx.send(options)

    emitter
      .once('transactionHash', (hash: string) => {
        Logger.debug('Sending transaction..')
        transactionHash = hash
        observer.next({
          state: ITransactionState.Sent,
          transactionHash
        })
      })
      .once('receipt', (receipt: any) => {
        Logger.debug(`transaction mined!`)
        try {
          result = map(receipt)
        } catch (err) {
          observer.error(err)
        }
        observer.next({
          confirmations: 0,
          receipt,
          result,
          state: ITransactionState.Mined,
          transactionHash
        })
      })
      .on('confirmation', (confNumber: number, receipt: any) => {
        // result should have been set by previous call to 'receipt', but better be sure
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
          state: ITransactionState.Mined,
          transactionHash
        })
        if (confNumber > 23) {
          // the web3 observer will confirm up to 24 subscriptions, so we are done here
          observer.complete()
        }
      })
      .on('error', async (error: Error) => {
        let errToReturn: Error
        try {
          errToReturn = await errorHandler(error)
        } catch (err) {
          errToReturn = err
        }
        observer.error(errToReturn)
      })
    }
  )
  observable.send = () => observable.pipe(take(2)).toPromise()
  return observable
}
