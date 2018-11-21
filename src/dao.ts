import { of, Observable } from 'rxjs'
import {
  Stateful,
  CommonQueryOptions,
  ProposalQueryOptions,
  VoteQueryOptions,
  RewardQueryOptions,
  StakeQueryOptions
} from './types'
import { Proposal, Vote, Stake } from './proposal'
import { Token } from './token'
import { Reputation } from './reputation'
import { Member } from './member'
import { Reward } from './reward'

export interface DAOState {
  address: string // address of the avatar
  name: string
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

  proposals(options: ProposalQueryOptions = {}): Observable<Proposal[]> {
    throw new Error('not implemented')
  }

  proposal(id: string): Proposal {
    return new Proposal(id)
  }

  rewards(options: RewardQueryOptions = {}): Observable<Reward[]> {
    throw new Error('not implemented')
  }

  votes(options: VoteQueryOptions = {}): Observable<Vote[]> {
    throw new Error('not implemented')
  }

  stakes(options: StakeQueryOptions = {}): Observable<Stake[]> {
    throw new Error('not implemented')
  }
}
