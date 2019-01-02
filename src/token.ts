import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { Arc } from './arc'
import { Address, Hash, IStateful } from './types'
import * as utils from './utils'

export interface ITokenState {
  address: Address
  name: string
  owner: Address
  symbol: string
  totalSupply: number
}

export interface IApproval {
  id: Hash
  txHash: Hash
  contract: Address
  owner: Address
  spender: Address
  value: number
}

export class Token implements IStateful<ITokenState> {

  public state: Observable<ITokenState> = of()

  constructor(public address: Address, public context: Arc) {
    const query = gql`{
      token(id: "${address.toLowerCase()}") {
        id,
        name,
        symbol,
        totalSupply
      }
    }`

    const itemMap = (item: any): ITokenState => {
      if (item === null) {
        throw Error(`Could not find a token contract with address ${address.toLowerCase()}`)
      }
      return {
        address: item.id,
        name: item.name,
        owner: item.owner,
        symbol: item.symbol,
        totalSupply: item.totalSupply
      }
    }
    this.state = this.context._getObservableObject(query, 'token', itemMap) as Observable<ITokenState>
  }

  public balanceOf(address: string): Observable<number> {
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
      map((r) => r.data.tokenHolders),
      map((items: any[]) => {
        const item = items.length > 0 && items[0]
        return item.balance !== undefined ? item.balance : 0
      })
    )
  }

  public approvals(address: string): Observable<any[]> {
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
    return this.context._getObservableList( query, 'tokenApprovals')
  }
}
