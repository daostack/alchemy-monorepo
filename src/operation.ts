import { Observable } from 'rxjs'

export enum TransactionState {
  Sent,
  Mined
}

/**
 * A transaction update is a snapshot of the state of a transaction at a particular time.
 */
export interface TransactionUpdate<T> {
  state: TransactionState
  /**
   * depth of the transaction in the blockchain.
   */
  depth: number
  /**
   * Parsed return value from the method call
   * or contract address in the case of contract creation tx.
   */
  result: T
}

/**
 * An operation is a stream of transaction updates
 */
export type Operation<T> = Observable<TransactionUpdate<T>>
