import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable, Observer, Subscription } from 'rxjs'
import { first } from 'rxjs/operators'
import { Arc, IApolloQueryOptions } from './arc'
import { ABI_DIR, DAOTOKEN_CONTRACT_VERSION } from './settings'
import { Address, Hash, ICommonQueryOptions, IStateful, Web3Receipt } from './types'
import { createGraphQlQuery, isAddress } from './utils'

export interface ITokenState {
  address: Address
  name: string
  owner: Address
  symbol: string
  totalSupply: BN
}

export interface ITokenQueryOptions extends ICommonQueryOptions {
  where?: {
    address?: Address
    name?: string
    owner?: Address
    symbol?: string
    [key: string]: any
  }
}

export interface IApproval {
  id: Hash
  txHash: Hash
  contract: Address
  owner: Address
  spender: Address
  value: BN
}

export interface IAllowance {
  token: Address
  owner: Address
  spender: Address
  amount: BN
}

export class Token implements IStateful<ITokenState> {

  /**
   * Token.search(context, options) searches for token entities
   * @param  context an Arc instance that provides connection information
   * @param  options the query options, cf. ITokenQueryOptions
   * @return         an observable of Token objects
   */
  public static search(
    context: Arc,
    options: ITokenQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<Token[]> {
    if (!options.where) { options.where = {}}
    let where = ''
    for (const key of Object.keys(options.where)) {
      if (options[key] === undefined) {
        continue
      }

      if (key === 'token' || key === 'owner' || key === 'spender') {
        const option = options[key] as string
        isAddress(option)
        options[key] = option.toLowerCase()
      }

      where += `${key}: "${options[key] as string}"\n`
    }

    const query = gql`query TokenSearch
    {
      tokens ${createGraphQlQuery(options, where)} {
        id
      }
    }`

    return context.getObservableList(
      query,
      (r: any) => new Token(r.id, context),
      apolloQueryOptions
    ) as Observable<Token[]>
  }

  public address: string

  constructor(public id: Address, public context: Arc) {
    if (!id) {
      throw Error(`No address provided - cannot create Token instance`)
    }
    isAddress(id)
    this.address = id
  }

  public state(apolloQueryOptions: IApolloQueryOptions = {}): Observable<ITokenState> {
    const query = gql`query tokenState {
      token(id: "${this.address.toLowerCase()}") {
        id,
        dao {
          id
        },
        name,
        symbol,
        totalSupply
      }
    }`

    const itemMap = (item: any): ITokenState => {
      if (item === null) {
        throw Error(`Could not find a token contract with address ${this.address.toLowerCase()}`)
      }
      return {
        address: item.id,
        name: item.name,
        owner: item.dao.id,
        symbol: item.symbol,
        totalSupply: new BN(item.totalSupply)
      }
    }
    return  this.context.getObservableObject(query, itemMap, apolloQueryOptions) as Observable<ITokenState>
  }

  /*
   * get a web3 contract instance for this token
   */
  public contract(mode?: 'readonly') {
    const abi = require(`${ABI_DIR}/${DAOTOKEN_CONTRACT_VERSION}/DAOToken.json`)
    return this.context.getContract(this.address, abi, mode)
  }

  public balanceOf(owner: string): Observable<BN> {
    const errHandler = async (err: Error) => {
      if (err.message.match(/Returned values aren't valid/g)) {
        // check if there is actually a contract deployed there
        const code = await this.context.web3.eth.getCode(this.address)
        if (code === '0x') {
          return new Error(`Cannot get balanceOf(): there is no contract at this address ${this.address}`)
        }
      }
      return err
    }
    const observable = Observable.create(async (observer: Observer<BN>) => {
      const contract = this.contract('readonly')
      let subscriptionReceive: Subscription
      let subscriptionSend: Subscription
      const unsubscribe = () => {
        if (subscriptionReceive) { subscriptionReceive.unsubscribe() }
        if (subscriptionSend) { subscriptionSend.unsubscribe() }
      }
      const subscribe = () => contract.methods.balanceOf(owner).call()
        .then((balance: string) => {
          if (balance === null) {
            observer.error(`balanceOf ${owner} returned null`)
          }
          observer.next(new BN(balance))
          subscriptionReceive = contract.events.Transfer({ filter: { to: owner }})
            .on('data', (data: any) => {
              contract.methods.balanceOf(owner).call().then((newBalance: string) => {
                observer.next(new BN(newBalance))
              })
            })
          subscriptionSend = contract.events.Transfer({ filter: { from: owner }})
            .on('data', (data: any) => {
              contract.methods.balanceOf(owner).call().then((newBalance: number) => {
                observer.next(new BN(newBalance))
              })
            })
        })
        .catch(async (err: Error) => {
          if (err.message.match(/connection not open/g)) {
            observer.error(await errHandler(err))
          } else {
            observer.error(await errHandler(err))
          }
        })
      await subscribe()
      return () => unsubscribe()
    })
    observable.first = () => observable.pipe(first()).toPromise()
    return observable
  }

  public allowance(owner: Address, spender: Address): Observable<BN> {
    return Observable.create(async (observer: Observer<BN>) => {
      let subscription: Subscription
      const contract = this.contract('readonly')
      contract.methods.allowance(owner, spender).call()
        .then((balance: string) => {
          if (balance === null) {
            observer.error(`balanceOf ${owner} returned null`)
          }
          observer.next(new BN(balance))
          subscription = contract.events.Approval({ filter: { _owner: owner }})
            .on('data', () => {
              // const newBalance = data.returnValues.value
              contract.methods.allowance(owner, spender).call().then((newBalance: number) => {
                observer.next(new BN(newBalance))
            })
          })
        })
        .catch((err: Error) => { observer.error(err)})
      return () => {
        if (subscription) {
          subscription.unsubscribe()
        }
      }
    })
  }

  public mint(beneficiary: Address, amount: BN) {
    const contract = this.contract()
    const transaction = contract.methods.mint(beneficiary, amount.toString())
    const mapReceipt = (receipt: Web3Receipt) => receipt
    return this.context.sendTransaction(transaction, mapReceipt)
  }

  public transfer(beneficiary: Address, amount: BN) {
    const contract = this.contract()
    const transaction = contract.methods.transfer(beneficiary, amount.toString())
    const mapReceipt = (receipt: Web3Receipt) => receipt
    return this.context.sendTransaction(transaction, mapReceipt)
  }

  public approveForStaking(spender: Address, amount: BN) {
    const stakingToken = this.contract()
    const transaction = stakingToken.methods.approve(spender, amount.toString())
    const mapReceipt = (receipt: Web3Receipt) => receipt
    return this.context.sendTransaction(transaction, mapReceipt)
  }
}
