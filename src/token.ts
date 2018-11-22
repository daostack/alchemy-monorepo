import { Address, Stateful } from './types'
import { Observable, of } from 'rxjs'

interface TokenState {
  address: Address
  name: string
  symbol: string
  totalSupply: number
}

export class Token implements Stateful<TokenState> {
  state: Observable<TokenState> = of()

  constructor(private address: Address) {}

  balanceOf(address: string): Observable<number> {
    throw new Error('not implemented')
  }
}
