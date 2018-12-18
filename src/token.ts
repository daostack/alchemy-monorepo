import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'
import { Arc } from './arc'
import { Address, IStateful } from './types'

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
    throw new Error('not implemented')
  }
}
