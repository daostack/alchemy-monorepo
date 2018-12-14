import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'
import { Arc } from './arc'
import { Address, IStateful } from './types'

interface ITokenState {
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
      tokenContract (id: "${address.toLowerCase()}") {
        id,
        address,
        totalSupply
      }
    }`

    const itemMap = (item: any): ITokenState => {
      if (item === null) {
        throw Error(`Could not find a token contract with address ${address.toLowerCase()}`)
      }
      return {
        address: item.address,
        // TODO: need to get the symbol and name: once https://github.com/daostack/subgraph/issues/36 is resolved
        name: 'To Be Done',
        owner: item.owner,
        symbol: 'TBD',
        totalSupply: item.totalSupply
      }
    }
    this.state = this.context._getObjectObservable(query, 'tokenContract', itemMap) as Observable<ITokenState>
  }

  public balanceOf(address: string): Observable<number> {
    throw new Error('not implemented')
  }
}
