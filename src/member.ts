import { Observable, of } from 'rxjs'
import { DAO } from './dao'
import {
  IProposalQueryOptions,
  IStake,
  IStakeQueryOptions,
  IVote,
  IVoteQueryOptions,
  Proposal
} from './proposal'
import { Reward } from './reward'
import { Address, ICommonQueryOptions, IStateful } from './types'

export interface IMemberState {
  address: Address
  dao: string
  eth: number
  reputation: number
  tokens: number
  gen: number
  approvedGen: number
}

/**
 * Represents a user of a DAO
 */

export class Member implements IStateful<IMemberState> {
  public state: Observable<IMemberState> = of()

  /**
   * [constructor description]
   * @param address address of the user
   * @param dao     address of the DAO
   */
  constructor(public address: Address, public dao: Address) {}

  public rewards(): Observable<Reward[]> {
    throw new Error('not implemented')
  }

  public proposals(options: IProposalQueryOptions = {}): Observable<Proposal[]> {
    throw new Error('not implemented')
    // const dao = new DAO(this.dao)
    // return dao.proposals(options)
  }

  public stakes(options: IStakeQueryOptions = {}): Observable<IStake[]> {
    throw new Error('not implemented')
    // const dao = new DAO(this.dao)
    // return dao.stakes(options)
  }

  public votes(options: IVoteQueryOptions = {}): Observable<IVote[]> {
    throw new Error('not implemented')
    // const dao = new DAO(this.dao)
    // return dao.votes(options)
  }
}

export interface IMemberQueryOptions extends ICommonQueryOptions {
  address?: Address
  dao?: Address
}
