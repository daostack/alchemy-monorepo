import BN = require('bn.js')
import { from } from 'rxjs'
import { concatMap } from 'rxjs/operators'

import {
  Operation,
  toIOperationObservable
} from '../operation'

import { Address } from '../types'

import { Scheme } from '../scheme'

export class CTL4RScheme {

  constructor(public scheme: Scheme) {

  }

  public async getAgreementHash(): Promise<string> {
    const contract = await this.getContract()
    const result = await contract.methods.getAgreementHash().call()
    return result
  }

  public async getReputationRewardForLockingIds(lockingIds: number[],
                                                batchIndex: number,
                                                repuationRewardForPeriod: BN)
                                                : Promise<BN> {
    let reputation = new BN('0')
    const contract = await this.getContract()
    const lockingTotalScore = new BN(await contract.methods.batches(batchIndex).call())
    for (const lockingId of lockingIds) {
      const lockingIdScore = new BN(await contract.methods.getLockingIdScore(batchIndex, lockingId).call())
      reputation = reputation.add(lockingIdScore.div(lockingTotalScore).mul(repuationRewardForPeriod))
    }
    return reputation
  }

  public lock(amount: BN, period: number, batchIndexToLockIn: number, agreementHash: string): Operation<any> {
    const mapReceipt = (receipt: any) => {
      return receipt
    }

    const observable = from(this.getContract())
      .pipe(
      concatMap((contract) => {
        let transaction: any
        transaction = contract.methods.lock(
          amount,
          period,
          batchIndexToLockIn,
          agreementHash
        )
        const errorHandler = async (error: Error) => {
          try {
            await transaction.call()
          } catch (err) {
            throw err
          }
          return error
        }
        return this.scheme.context.sendTransaction(transaction, mapReceipt, errorHandler)
      })
    )
    return toIOperationObservable(observable)
  }

    public extendLocking(extendPeriod: number,
                         batchIndexToLockIn: number,
                         lockingId: number,
                         agreementHash: string): Operation<any> {
      const mapReceipt = (receipt: any) => {
        return receipt
      }

      const observable = from(this.getContract())
        .pipe(
        concatMap((contract) => {
          let transaction: any
          transaction = contract.methods.extendLocking(
            extendPeriod,
            batchIndexToLockIn,
            lockingId,
            agreementHash
          )
          const errorHandler = async (error: Error) => {
            try {
              await transaction.call()
            } catch (err) {
              throw err
            }
            return error
          }
          return this.scheme.context.sendTransaction(transaction, mapReceipt, errorHandler)
        })
      )
      return toIOperationObservable(observable)
    }
    public release(beneficiary: Address, lockingId: number): Operation<any> {
      const mapReceipt = (receipt: any) => {
        return receipt
      }

      const observable = from(this.getContract())
        .pipe(
        concatMap((contract) => {
          let transaction: any
          transaction = contract.methods.release(
            beneficiary,
            lockingId
          )
          const errorHandler = async (error: Error) => {
            try {
              await transaction.call()
            } catch (err) {
              throw err
            }
            return error
          }
          return this.scheme.context.sendTransaction(transaction, mapReceipt, errorHandler)
        })
      )
      return toIOperationObservable(observable)
    }

  public async getContract() {
    const state = await this.scheme.fetchStaticState()
    await this.scheme.context.fetchContractInfos({fetchPolicy: 'network-only'})
    const contract = this.scheme.context.getContract(state.address)
    return contract
  }

  public getScheme() {
    return this.scheme
  }

}
