import { ApolloQueryResult } from 'apollo-client'
import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Arc, IApolloQueryOptions } from './arc'
import { REPUTATION_CONTRACT_VERSION } from './settings'
import { Address, ICommonQueryOptions, IStateful, Web3Receipt } from './types'
import { createGraphQlQuery, isAddress } from './utils'

export interface IReputationState {
  address: Address
  totalSupply: BN
  dao: Address
}

export interface IReputationQueryOptions extends ICommonQueryOptions {
  id?: string
  dao?: Address
  [key: string]: any
}

export class Reputation implements IStateful<IReputationState> {

  /**
   * Reputation.search(context, options) searches for reputation entities
   * @param  context an Arc instance that provides connection information
   * @param  options the query options, cf. IReputationQueryOptions
   * @return         an observable of Reputation objects
   */
  public static search(
    context: Arc,
    options: IReputationQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<Reputation[]> {
    let where = ''
    if (!options.where) { options.where = {}}
    for (const key of Object.keys(options.where)) {
      if (options[key] === undefined) {
        continue
      }

      if (key === 'dao') {
        const option = options[key] as string
        isAddress(option)
        options[key] = option.toLowerCase()
      }

      where += `${key}: "${options[key] as string}"\n`
    }

    const query = gql`query ReputationSearch {
      reps
      ${createGraphQlQuery(options, where)}
      {
        id
      }
    }`

    return context.getObservableList(
      query,
      (r: any) => new Reputation(r.id, context),
      apolloQueryOptions
    )
  }

  public address: Address
  constructor(public id: Address, public context: Arc) {
    isAddress(id)
    this.address = id
  }
  public state(apolloQueryOptions: IApolloQueryOptions = {}): Observable<IReputationState> {
    const query = gql`query ReputationState
    {
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
        totalSupply: new BN(item.totalSupply)
      }
    }
    return  this.context.getObservableObject(query, itemMap, apolloQueryOptions) as Observable<IReputationState>
  }

  public reputationOf(address: Address): Observable<BN> {
    isAddress(address)

    const query = gql`query ReputationHolderReputation {
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
    const abi = this.context.getABI(undefined, 'Reputation', REPUTATION_CONTRACT_VERSION)
    return this.context.getContract(this.address, abi)
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
      await transaction.call()
      return err
    }
    return this.context.sendTransaction(transaction, mapReceipt, errHandler)
  }

}
