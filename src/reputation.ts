import { Address, Stateful } from './types'
import { Observable, of } from 'rxjs'

interface ReputationState {
  address: Address
  name: string
  symbol: string
  totalSupply: number
}

export class Reputation implements Stateful<ReputationState> {
  state: Observable<ReputationState> = of()
  constructor(private address: Address) {}

  reputationOf(address: Address): Observable<number> {
    throw new Error('not implemented')
  }
}
