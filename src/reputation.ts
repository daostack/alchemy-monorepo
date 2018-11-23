import { Observable, of } from 'rxjs'
import { Address, IStateful } from './types'

interface IReputationState {
  address: Address
  name: string
  symbol: string
  totalSupply: number
}

export class Reputation implements IStateful<IReputationState> {
  public state: Observable<IReputationState> = of()
  constructor(private address: Address) {}

  public reputationOf(address: Address): Observable<number> {
    throw new Error('not implemented')
  }
}
