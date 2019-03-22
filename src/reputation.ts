import { ApolloQueryResult } from 'apollo-client'
import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Arc } from './arc'
import { Address, IStateful, Web3Receipt } from './types'
import { getWeb3Options, isAddress } from './utils'

export interface IReputationState {
  address: Address
  totalSupply: number
}

export class Reputation implements IStateful<IReputationState> {

  constructor(public address: Address, public context: Arc) {
    isAddress(address)
  }
  public state(): Observable<IReputationState> {
    const query = gql`{
      reputationContract (id: "${this.address.toLowerCase()}") {
        id,
        address,
        totalSupply
      }
    }`
    const itemMap = (item: any): IReputationState => {
      if (item === null) {
        throw Error(`Could not find a reputation contract with address ${this.address.toLowerCase()}`)
      }
      return {
        address: item.address,
        totalSupply: item.totalSupply
      }
    }
    return this.context._getObservableObject(query, itemMap) as Observable<IReputationState>
  }

  public reputationOf(address: Address): Observable<BN> {
    isAddress(address)
    const query = gql`{
      reputationHolders (
        where: { address:"${address}",
        contract: "${this.address}"}
      )
      {
        id, address, balance,contract
      }
    }`
    return this.context.getObservable(query).pipe(
      map((r: ApolloQueryResult<any>) => r.data.reputationHolders),
      map((items: any[]) => {
        const item = items.length > 0 && items[0]
        return item.balance !== undefined ? new BN(item.balance) : new BN(0)
      })
    )
  }

  /*
   * get a web3 contract instance for this token
   */
  public contract() {
    const opts = getWeb3Options(this.context.web3)
    const ReputationContractInfo = require('@daostack/arc/build/contracts/Reputation.json')
    return new this.context.web3.eth.Contract(ReputationContractInfo.abi, this.address, opts)
  }

  public mint(beneficiary: Address, amount: BN) {
    const contract = this.contract()
    const transaction = contract.methods.mint(beneficiary, amount.toString())
    const mapReceipt = (receipt: Web3Receipt) => receipt
    const sender = this.context.web3.eth.accounts.wallet[0].address
    const errHandler = async (err: Error) => {
      const owner = contract.methods.owner().call()
      if (owner.toLowercase() !== sender.toLowerCase()) {
        throw Error(`Minting failed: sender ${sender} is not the owner of the contract (which is ${owner})`)
      }
      throw err
    }
    return this.context.sendTransaction(transaction, mapReceipt, errHandler)
  }

}
