import { Stateful } from './types'
import { of, Observable } from 'rxjs'
import { Reward } from './reward'

interface MemberState {
  address: string
  dao: string
  eth: number
  reputation: number
  tokens: number
  gen: number
}

export class Member implements Stateful<MemberState> {
  state: Observable<MemberState> = of()
  constructor(private dao: string, private address: string) {}

  rewards(): Observable<Reward> {
    throw new Error('not implemented')
  }
}
