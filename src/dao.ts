import { Observable, of } from 'rxjs'
import { IMemberQueryOptions, Member } from './member'
import {
  IProposalQueryOptions,
  IStake,
  IStakeQueryOptions,
  IVote,
  IVoteQueryOptions,
  Proposal
} from './proposal'
import { Reputation } from './reputation'
import { IRewardQueryOptions, Reward } from './reward'
import { Token } from './token'
import { Address, ICommonQueryOptions, IStateful } from './types'

export interface IDAOState {
  address: Address // address of the avatar
  name: string
  token: Token
  reputation: Reputation
  members: number
}

export class DAO implements IStateful<IDAOState> {
  public state: Observable<IDAOState> = of()

  constructor(public address: string) {}

  public members(options: IMemberQueryOptions = {}): Observable<Member[]> {
    throw new Error('not implemented')
  }

  public proposals(options: IProposalQueryOptions = {}): Observable<Proposal[]> {
    throw new Error('not implemented')
  }

  public proposal(id: string): Proposal {
    return new Proposal(id)
  }

  public rewards(options: IRewardQueryOptions = {}): Observable<Reward[]> {
    throw new Error('not implemented')
  }

  public votes(options: IVoteQueryOptions = {}): Observable<IVote[]> {
    throw new Error('not implemented')
  }

  public stakes(options: IStakeQueryOptions = {}): Observable<IStake[]> {
    throw new Error('not implemented')
  }
}

export interface IDAOQueryOptions extends ICommonQueryOptions {
  address?: Address
  name?: string
}
