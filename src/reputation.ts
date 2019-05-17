import { ApolloQueryResult } from 'apollo-client'
import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Arc, IApolloQueryOptions } from './arc'
import { Address, ICommonQueryOptions, IStateful, Web3Receipt } from './types'
import { isAddress } from './utils'

export interface IReputationState {
  address: Address
  totalSupply: number
  dao: Address
}

export interface IReputationQueryOptions extends ICommonQueryOptions {
  id: string,
  dao: Address
}

export class Reputation implements IStateful<IReputationState> {
  public static search(
    options: IReputationQueryOptions,
    context: Arc,
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<Reputation[]> {
    let where = ''
    for (const key of Object.keys(options)) {
      if (options[key] !== undefined) {
        where += `${key}: "${options[key] as string}"\n`
      }
    }

    const query = gql`{
      reps(where: {
        ${where}
      }) {
        id
      }
    }`

    return context.getObservableList(
      query,
      (r: any) => new Reputation(r.id, context),
      apolloQueryOptions
    )
  }

  constructor(public address: Address, public context: Arc) {
    isAddress(address)
  }
  public state(): Observable<IReputationState> {
    const query = gql`{
      rep (id: "${this.address.toLowerCase()}") {
        id
        totalSupply
        dao {
          id
        }
      }
    }`
    const itemMap = (item: any): IReputationState => {
      if (item === null) {
        throw Error(`Could not find a reputation contract with address ${this.address.toLowerCase()}`)
      }
      return {
        address: item.id,
        dao: item.dao.id,
        totalSupply: item.totalSupply
      }
    }
    return this.context.getObservableObject(query, itemMap) as Observable<IReputationState>
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
    const ReputationContractInfo = require('@daostack/arc/build/contracts/Reputation.json')
    return new this.context.web3.eth.Contract(ReputationContractInfo.abi, this.address)
  }

  public mint(beneficiary: Address, amount: BN) {
    const contract = this.contract()
    const transaction = contract.methods.mint(beneficiary, amount.toString())
    const mapReceipt = (receipt: Web3Receipt) => receipt
    const sender = this.context.web3.eth.accounts.wallet[0].address
    const errHandler = async (err: Error) => {
      const owner = await contract.methods.owner().call()
      if (owner.toLowerCase() !== sender.toLowerCase()) {
        return Error(`Minting failed: sender ${sender} is not the owner of the contract at ${contract._address}` +
          `(which is ${owner})`)
      }
      return err
    }
    return this.context.sendTransaction(transaction, mapReceipt, errHandler)
  }

}
