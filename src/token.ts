import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { Arc } from './arc'
import { Address, IStateful } from './types'
import * as utils from './utils'

export interface ITokenState {
  address: Address
  name: string
  owner: Address
  symbol: string
  totalSupply: number
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
    this.state = this.context._getObjectObservable(query, 'token', itemMap) as Observable<ITokenState>
  }

  public balanceOf(address: string): Observable<number> {
    const query = gql`{
      tokenHolders (
        where: { address:"0xb0c908140fe6fd6fbd4990a5c2e35ca6dc12bfb2",
        contract: "${this.address}"}
      )
      {
        id, address, balance,contract
      }
    }`
    return this.context._getObservable(query).pipe(
      map((r) => r.data.tokenHolders),
      map((items: any[]) => {
        const item = items.length > 0 && items[0]
        return Number(item.balance)
      })
    )
  }
}
