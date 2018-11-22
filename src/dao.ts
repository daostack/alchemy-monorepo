import { of, Observable } from 'rxjs'
import { Address, CommonQueryOptions, Stateful } from './types'
import {
  Proposal,
  ProposalQueryOptions,
  Stake,
  StakeQueryOptions,
  Vote,
  VoteQueryOptions
} from './proposal'
import { Token } from './token'
import { Reputation } from './reputation'
import { Member } from './member'
import { Reward, RewardQueryOptions } from './reward'

export interface DAOState {
  address: Address // address of the avatar
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

export interface DaoQueryOptions extends CommonQueryOptions {
  address?: Address
  name?: string
}
