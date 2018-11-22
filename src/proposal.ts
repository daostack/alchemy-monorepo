import { Observable, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

import { DAO } from './dao'
import { Operation } from './operation'
import { Reward, RewardQueryOptions } from './reward'
import { Address, CommonQueryOptions, Date, Stateful } from './types'

export enum Outcome {
  Pass,
  Fail
}

export enum ProposalStage {
  // pre boosted
  // | { open: true }
  preboosted,
  // boosted
  // | { boosted: true; boostedAt: number }
  boosted,
  // quiet ending
  // | { overtimed: true; boostedAt: number; overtimedAt: number }
  overtimed,
  // passed in pre boosted phase (via absolute vote)
  // | { passed: true; executedAt: number }
  passed,
  // passed in boosted phase
  // | { passed: true; executedAt: number; boosted: true; boostedAt: number; overtimedAt?: number }
  'passed-boosted',
  // failed in pre boosted phase
  // | { failed: true }
  failed,
  // failed in boosted phase
  // | { failed: true; boosted: true; boostedAt: number }
  'failed-boosted'
}

export interface ProposalState {
  id: string
  dao: string
  // address of the proposer
  proposer: string

  // title, description and url still to be implemented
  ipfsHash: string
  title?: string
  description?: string
  url?: string

  createdAt: Date
  boostedAt: Date
  overtimedAt: Date
  // date when the proposal is executed, null if not executed yet
  executedAt: Date
  // Date on which the proposal is resolved, or expected to be resolved
  resolvesAt: Date
  // stage is calculated on the basis of the previous values
  stage: ProposalStage

  votesFor: number
  votesAgainst: number

  winningOutcome: Outcome

  stakesFor: number
  stakesAgainst: number
  boostingThreshold: number

  beneficiary: string
  reputationReward: number
  tokensReward: number
  ethReward: number
  externalTokenReward: number
  externalToken: string
  periods: number
  periodLength: number
}

export interface Vote {
  address: Address
  outcome: Outcome
  amount: number // amount of reputation that was voted with
  proposalId: string
}

export interface Stake {
  address: Address
  outcome: Outcome
  amount: number // amount staked
  proposalId: string
}

export class Proposal implements Stateful<ProposalState> {
  /**
   * `state` is an observable of the proposal state
   */
  state: Observable<ProposalState> = of()

  constructor(private id: string) {}

  dao(): Observable<DAO> {
    return this.state.pipe(
      map(state => {
        return new DAO(state.dao)
      })
    )
  }

  votes(options: VoteQueryOptions = {}): Observable<Vote[]> {
    return this.dao().pipe(
      switchMap(dao => {
        return dao.votes({ ...options, proposalId: this.id })
      })
    )
  }

  vote(outcome: Outcome): Operation<void> {
    throw new Error('not implemented')
  }

  stakes(options: StakeQueryOptions = {}): Observable<Stake[]> {
    return this.dao().pipe(
      switchMap(dao => {
        return dao.stakes({ ...options, proposalId: this.id })
      })
    )
  }

  stake(outcome: Outcome, amount: number): Operation<void> {
    throw new Error('not implemented')
  }

  rewards(options: RewardQueryOptions = {}): Observable<Reward[]> {
    return this.dao().pipe(
      switchMap(dao => {
        return dao.rewards({ ...options, proposalId: this.id })
      })
    )
  }
}

enum ProposalQuerySortOptions {
  resolvesAt = 'resolvesAt'
  // 'resolvesAt' should be ok for the current alchemy; will add more options as needed.
}

export interface ProposalQueryOptions extends CommonQueryOptions {
  active?: boolean
  boosted?: boolean
  proposer?: Address
  proposalId?: string
  stage?: ProposalStage
  orderBy?: ProposalQuerySortOptions
  // the options above should be ok for the current alchemy; will add more options as needed
  executedAfter?: Date
  executedBefore?: Date
}

export interface VoteQueryOptions extends CommonQueryOptions {
  proposalId?: string
}

export interface StakeQueryOptions extends CommonQueryOptions {
  proposalId?: string
}
