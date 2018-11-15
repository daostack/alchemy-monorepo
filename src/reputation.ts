import { Stateful } from './types'
import { Observable, of } from 'rxjs'

interface ReputationState {
  address: string
  name: string
  symbol: string
  totalSupply: number
}

export class Reputation implements Stateful<ReputationState> {
  state: Observable<ReputationState> = of()
  constructor(private address: string) {}

  reputationOf(address: string): Observable<number> {
    throw new Error('not implemented')
  }
}
