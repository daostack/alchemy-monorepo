import { Observable, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

import { DAO } from './dao'
import { Operation } from './operation'
import { Reward } from './reward'
import { Stateful, RewardQueryOptions, StakeQueryOptions, VoteQueryOptions } from './types'

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

  createdAt: number
  boostedAt: number
  overtimedAt: number
  executedAt: number
  // date when the proposal is resolved, null if not resolved yet
  resolvedAt: number
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
  address: string
  outcome: Outcome
  amount: number // amount of reputation that was voted with
  proposalId: string
}

export interface Stake {
  address: string
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
        options.proposalId = this.id
        return dao.votes(options)
      })
    )
  }

  vote(outcome: Outcome): Operation<void> {
    throw new Error('not implemented')
  }

  stakes(options: StakeQueryOptions = {}): Observable<Stake[]> {
    return this.dao().pipe(
      switchMap(dao => {
        options.proposalId = this.id
        return dao.stakes(options)
      })
    )
  }

  stake(outcome: Outcome, amount: number): Operation<void> {
    throw new Error('not implemented')
  }

  rewards(options: RewardQueryOptions = {}): Observable<Reward[]> {
    return this.dao().pipe(
      switchMap(dao => {
        options.proposalId = this.id
        return dao.rewards(options)
      })
    )
  }
}
