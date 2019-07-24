import { from } from 'rxjs'
import { concatMap, first, take } from 'rxjs/operators'
// import { Arc } from '../arc'
import {
  IOperationObservable,
  // toIOperationObservable,
  ITransactionUpdate,
  Operation
} from '../operation'
import { Scheme } from '../scheme'
import { Address } from '../types'

export class ReputationFromTokenScheme extends Scheme {
  // constructor(idOrOpts: Address|ISchemeStaticState, public context: Arc) {
  //   super(idOrOpts, context)
  // }

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

        return this.context.sendTransaction(redeemMethod, mapReceipt, errorHandler)
      })
    )

    // @ts-ignore
    observable.send = () => observable.pipe(take(3)).toPromise()
    return observable as IOperationObservable<ITransactionUpdate<any>>
    // return toIOperationObservable(observable)
  }

  public async redemptionAmount(beneficiary: Address): Promise<number> {
    const contract = await this.getContract()
    const amount = await contract.methods.redeem(beneficiary).call()
    return amount
  }

  private async getContract() {
    // const state = await this.fetchStaticState()
    const state = await this.state().pipe(first()).toPromise()
    const contract =  this.context.getContract(state.address)
    return contract
  }

}
