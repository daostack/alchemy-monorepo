import BN = require('bn.js')
import {Decimal} from 'decimal.js'
import { from } from 'rxjs'
import { concatMap } from 'rxjs/operators'
import { realMathToBN, realMathToNumber } from '../utils'

import {
  Operation,
  toIOperationObservable
} from '../operation'

import { Address } from '../types'

import { Scheme } from '../scheme'

// same address for all networks (mainnet,kovan,xdai,rinkeby)
const CT4RRedeemerAddress = '0x829BDfd41d517f57E5eBf13AD0E181351cb16a96'

const CT4RRedeemerABI = [
    {
      constant: false,
      inputs: [
        {
          internalType: 'contract ContinuousLocking4Reputation',
          name: 'clt4Reputation',
          type: 'address'
        },
        {
          components: [
            {
              internalType: 'address',
              name: 'beneficiary',
              type: 'address'
            },
            {
              internalType: 'uint256',
              name: 'id',
              type: 'uint256'
            }
          ],
          internalType: 'struct NectarReputationRedeemer.Redeem[]',
          name: 'clt4rRedeems',
          type: 'tuple[]'
        }
      ],
      name: 'redeemContinuousLocking4Reputation',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ]

export class CL4RScheme {

  constructor(public scheme: Scheme) {

  }

  /**
   * getRepuationRewardForBatch
   * according to the formula
   * repPerBatch = _repRewardConstA * ((_repRewardConstB/1000) ** batchIndex)
   * @param  repRewardConstA
   * @param  repRewardConstB
   * @param  batchIndex the batchIndex to calculate
   * @return     RepuationRewardForBatch
   */
  public async getRepuationRewardForBatch(repRewardConstA: string,
                                          repRewardConstB: string,
                                          batchIndex: number)
                                          : Promise<Decimal> {
    const constB = new Decimal(realMathToNumber(new BN(repRewardConstB)))
    const constA = new Decimal(realMathToBN(new BN(repRewardConstA)).toString())
    return constA.times(constB.toPower(batchIndex))
  }

  public async getAgreementHash(): Promise<string> {
    const contract = await this.getContract()
    const result = await contract.methods.getAgreementHash().call()
    return result
  }

  public async getReputationRewardForLockingIds(lockingIds: number[],
                                                batchIndex: number,
                                                repuationRewardForPeriod: Decimal)
                                                : Promise<Decimal> {
    let reputation = new Decimal('0')
    const contract = await this.getContract()
    const lockingTotalScore = new Decimal(await contract.methods.batches(batchIndex).call())

    if (lockingTotalScore.isZero()) {
      return lockingTotalScore
    }
    for (const lockingId of lockingIds) {
      const lockingIdScore = new Decimal(await contract.methods.getLockingIdScore(batchIndex, lockingId).call())
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

    /**
     * redeem redeem reputation for a beneficiary for all is lockingIds
     * @param  beneficiary
     * @param  lockingIds
     * @param  network network is a optional.
     * @return     RepuationRewardForBatch
     */
    public redeem(beneficiary: Address, lockingIds: number[], ct4rRedeemerAddress?: Address): Operation<any> {
      const mapReceipt = (receipt: any) => {
        return receipt
      }

      const ctl4rReedeems: any = []
      for (const lockingId of lockingIds) {
         ctl4rReedeems.push({beneficiary, id: lockingId.toString()})
      }

      const observable = from(this.getCT4RRedeemer(ct4rRedeemerAddress ? ct4rRedeemerAddress : CT4RRedeemerAddress))
        .pipe(
        concatMap((contract) => {
          let transaction: any
          transaction = contract.methods.redeemContinuousLocking4Reputation(
            (this.scheme.staticState as any).address,
            ctl4rReedeems
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
    const address = await this.getContractAddress()
    await this.scheme.context.fetchContractInfos({fetchPolicy: 'network-only'})
    const contract = this.scheme.context.getContract(address)
    return contract
  }

  public async getContractAddress() {
    return (await this.scheme.fetchStaticState()).address
  }

  public async getCT4RRedeemer(ct4rRedeemerAddress?: Address) {
    return await new this.scheme.context.web3.eth.Contract(CT4RRedeemerABI, ct4rRedeemerAddress)
  }

  public getScheme() {
    return this.scheme
  }

}
