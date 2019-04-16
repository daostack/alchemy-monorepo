import { ApolloQueryResult } from 'apollo-client'
import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable, Observer, of, Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { Arc } from './arc'
import { Logger } from './logger'
import { Address, Hash, IStateful, Web3Receipt } from './types'
import { getWeb3Options, isAddress } from './utils'

export interface ITokenState {
  address: Address
  name: string
  owner: Address
  symbol: string
  totalSupply: BN
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

  constructor(public address: Address, public context: Arc) {
    if (!address) {
      throw Error(`No address provided - cannot create Token instance`)
    }
    isAddress(address)
  }

  public state(): Observable<ITokenState> {
    const query = gql`{
      token(id: "${this.address.toLowerCase()}") {
        id,
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
        owner: item.owner,
        symbol: item.symbol,
        totalSupply: new BN(item.totalSupply)
      }
    }
    return this.context._getObservableObject(query, itemMap) as Observable<ITokenState>
  }

  /**
   * This functino is (temporarily?) unavailable
   * because of indexing times that regard the entire token history
   * it is replaced by `this.balanceOf()` which subscribed to the thereum node
   * @param  address [description]
   * @return         [description]
   */
  public balanceOfFromSubgraph(address: string): Observable<BN> {
    if (true as any) {
      throw new Error(`This function is obsolete`)
    }

    const query = gql`{
      tokenHolders (
        where: {
          address:"${address}",
          contract: "${this.address}"
        }
      )
      {
        id, address, balance,contract
      }
    }`
    return this.context.getObservable(query).pipe(
      map((r: ApolloQueryResult<any>) => r.data.tokenHolders),
      map((items: any[]) => {
        const item = items.length > 0 && items[0]
        if (item) {
          return new BN(item.balance)
        } else {
          return new BN(0)
        }
      })
    )
  }

  public balanceOf(owner: string): Observable<BN> {
    return Observable.create(async (observer: Observer<BN>) => {
      const contract = this.contract()
      console.log('open balance subscription')
      let subscription: Subscription
      console.log('get balance')
      contract.methods.balanceOf(owner).call()
        .then((balance: number) => {
          if (balance === null) {
            observer.error(`balanceOf ${owner} returned null`)
          }
          observer.next(new BN(balance))
          subscription = contract.events.Transfer({ filter: { _to: owner }})
            .on('data', () => {
              // const newBalance = data.returnValues.value
              console.log('get balance')
              contract.methods.balanceOf(owner).call().then((newBalance: number) => {
                observer.next(new BN(newBalance))
              })
            })
        })
        .catch((err: Error) => { observer.error(err)})
      return () => {
        if (subscription) { subscription.unsubscribe() }
      }
    })
  }

  public allowance(owner: Address, spender: Address): Observable<BN> {
    return Observable.create(async (observer: Observer<BN>) => {
      console.log('open allowance subscription')
      let subscription: Subscription
      const contract = this.contract()
      contract.methods.allowance(owner, spender).call()
        .then((balance: number) => {
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
          console.log('close allowance subscription')
          subscription.unsubscribe()
        }
      }
    })
  }

  /*
   * get a web3 contract instance for this token
   */
  public contract() {
    const opts = getWeb3Options(this.context.web3)
    const ReputationContractInfo = require('@daostack/arc/build/contracts/DAOToken.json')
    return new this.context.web3.eth.Contract(ReputationContractInfo.abi, this.address, opts)
  }

  public mint(beneficiary: Address, amount: BN) {
    const contract = this.contract()
    const transaction = contract.methods.mint(beneficiary, amount.toString())
    const mapReceipt = (receipt: Web3Receipt) => receipt
    return this.context.sendTransaction(transaction, mapReceipt)
  }

  public approveForStaking(amount: BN) {
    const stakingToken = this.contract()
    const genesisProtocol = this.context.getContract('GenesisProtocol')

    const transaction = stakingToken.methods.approve(genesisProtocol.options.address, amount.toString())

    const mapReceipt = (receipt: Web3Receipt) => {
      if (Object.keys(receipt.events).length  === 0) {
        // this does not mean that anything failed,
        return receipt
      } else {
        return receipt
      }
    }
    return this.context.sendTransaction(transaction, mapReceipt)
  }

  public approvals(address: string): Observable<any[]> {
    if (true as any) {
      throw new Error(`This function is obsolete`)
    }
    const query = gql`{
      tokenApprovals (
        where: {
          owner: "${address}",
          contract: "${this.address}"
        }
      )
      {
        id, contract, owner, spender, txHash, value
      }
    }`
    return this.context._getObservableList(query)
  }

  public allowances(options: { owner?: Address, spender?: Address}): Observable<IAllowance[]> {
    // the allownaces entry tracks the GEN token, so the query only makes sense if the current token is the GEN token
    if (true as any) {
      throw new Error(`This function is obsolete`)
    }

    if (this.address !== this.context.getContract('GEN').options.address) {
      throw Error(`This token is not the GEN token - cannot query for allowances`)
    }

    let whereclause = ''
    if (options.owner) {
      whereclause += `owner: "${options.owner.toLowerCase()}"\n`
    }
    if (options.spender) {
      whereclause += `spender: "${options.spender.toLowerCase()}"\n`
    }
    whereclause += `token: "${this.address.toLowerCase()}"\n`
    if (whereclause) {
      whereclause = `(where: { ${whereclause}})`
    }
    const query = gql`{
      allowances
        ${whereclause}
      {
        id
        token
        owner
        spender
        amount
      }
    }`
    const itemMap = (r: any) => {
      return {
        amount: new BN(r.amount),
        owner: r.owner,
        spender: r.spender
      }
    }
    return this.context._getObservableList(query, itemMap)
  }
}
