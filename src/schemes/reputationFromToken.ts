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

  public redeem(beneficiary: Address): Operation<any> {
    const mapReceipt = (receipt: any) => {
      return receipt
    }

    const observable = from(this.getContract())
      .pipe(
      concatMap((contract) => {
        const errorHandler = async (error: Error) => {
          return error
        }

        const redeemMethod = contract.methods.redeem(
          beneficiary
        )

        return this.scheme.context.sendTransaction(redeemMethod, mapReceipt, errorHandler)
      })
    )
    return toIOperationObservable(observable)
  }

  public async redemptionAmount(beneficiary: Address): Promise<number> {
    const contract = await this.getContract()
    const amount = await contract.methods.redeem(beneficiary).call()
    return amount
  }

  private async getContract() {
    const state = await this.scheme.fetchStaticState()
    const contract =  this.scheme.context.getContract(state.address)
    return contract
  }

}
