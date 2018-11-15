import { Stateful } from './types'
import { Proposal } from './proposal'
import { of, Observable } from 'rxjs'
import { Token } from './token'
import { Reputation } from './reputation'
import { Member } from './member'
import { Reward } from './reward'

export interface DAOState {
  address: string
  token: Token
  reputation: Reputation
  members: number
}

export class DAO implements Stateful<DAOState> {
  state: Observable<DAOState> = of()
  constructor(private address: string) {}

  members(): Observable<Member[]> {
    throw new Error('not implemented')
  }

  proposals(): Observable<Proposal[]> {
    throw new Error('not implemented')
  }

  proposal(id: string): Proposal {
    return new Proposal(id)
  }

  rewards(): Observable<Reward[]> {
    throw new Error('not implemented')
  }
}
