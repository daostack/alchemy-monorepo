import { Observable, of } from 'rxjs'
import { Address, IStateful } from './types'

interface ITokenState {
  address: Address
  name: string
  symbol: string
  totalSupply: number
}

export class Token implements IStateful<ITokenState> {
  public state: Observable<ITokenState> = of()

  constructor(private address: Address) {}

  public balanceOf(address: string): Observable<number> {
    throw new Error('not implemented')
  }
}
