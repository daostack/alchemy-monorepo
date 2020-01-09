import { from } from 'rxjs'
import { concatMap } from 'rxjs/operators'

import {
  Operation,
  toIOperationObservable
} from '../operation'

import { Address } from '../types'

import { Scheme } from '../scheme'

export class ReputationFromTokenScheme {

  constructor(public scheme: Scheme) {

  }

  public async getAgreementHash(): Promise<string> {
    const contract = await this.getContract()
    const result = await contract.methods.getAgreementHash().call()
    return result
  }

  public redeem(beneficiary: Address, agreementHash?: string): Operation<any> {
    const mapReceipt = (receipt: any) => {
      return receipt
    }

    const observable = from(this.getContract())
      .pipe(
      concatMap((contract) => {
        let transaction: any
        const contractInfo = this.scheme.context.getContractInfo(contract.options.address)
        const contractVersion = contractInfo.version
        const versionNumber = Number(contractVersion.split('rc.')[1])
        if (versionNumber <= 32) {
          transaction = contract.methods.redeem(
            beneficiary
          )
        } else {
          if (!agreementHash) {
            throw Error(`For ReputationForToken version > rc.32, an "agreementHash" argument must be provided`)
          }
          transaction = contract.methods.redeem(
            beneficiary,
            agreementHash
          )

        }

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

  public async redemptionAmount(beneficiary: Address): Promise<number> {
    const contract = await this.getContract()
    const amount = await contract.methods.redeem(beneficiary).call()
    return amount
  }

  public async getContract() {
    const state = await this.scheme.fetchStaticState()
    const contract = this.scheme.context.getContract(state.address)
    return contract
  }

}
