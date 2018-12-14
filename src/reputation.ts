import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'
import { Arc } from './arc'
import { Address, IStateful } from './types'

interface IReputationState {
  address: Address
  name: string
  symbol: string
  totalSupply: number
}

export class Reputation implements IStateful<IReputationState> {

  public state: Observable<IReputationState>

  constructor(public address: Address, public context: Arc) {
    const query = gql`{
      reputationContract (id: "${address.toLowerCase()}") {
        id,
        address,
        totalSupply
      }
    }`
    const itemMap = (item: any): IReputationState => {
      if (item === null) {
        throw Error(`Could not find a reputation contract with address ${address.toLowerCase()}`)
      }
      return {
        address: item.address,
        // TODO: need to get the symbol and name: once https://github.com/daostack/subgraph/issues/36 is resolved
        name: 'REP',
        symbol: 'REP',
        totalSupply: item.totalSupply
      }
    }
    this.state = this.context._getObjectObservable(query, 'reputationContract', itemMap) as Observable<IReputationState>
  }

  public reputationOf(address: Address): Observable<number> {
    throw new Error('not implemented')
  }
}
