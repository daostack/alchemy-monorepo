import { Observable, of } from 'rxjs'
import { Operation } from './operation'
import { Stateful } from './types'
import { Reward } from './reward'

export enum Outcome {
  Pass,
  Fail
}

export type ProposalStage =
  // pre boosted
  // | { open: true }
  | 'preboosted'
  // boosted
  // | { boosted: true; boostedAt: number }
  | 'boosted'
  // quiet ending
  // | { overtimed: true; boostedAt: number; overtimedAt: number }
  | 'overtimed'
  // passed in pre boosted phase (via absolute vote)
  // | { passed: true; executedAt: number }
  | 'passed'
  // passed in boosted phase
  // | { passed: true; executedAt: number; boosted: true; boostedAt: number; overtimedAt?: number }
  | 'passed-boosted'
  // failed in pre boosted phase
  // | { failed: true }
  | 'failed'
  // failed in boosted phase
  // | { failed: true; boosted: true; boostedAt: number }
  | 'failed-boosted'

export interface ProposalState {
  id: string
  dao: string
  // address of the proposer
  proposer: string

  // title, descriptino and url still to be implemented
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
}

export interface Stake {
  address: string
  outcome: Outcome
  amount: number // amount staked
}

export class Proposal implements Stateful<ProposalState> {
  /**
   * `state` is an observable of the proposal state
   */
  state: Observable<ProposalState> = of()

  constructor(private id: string) {}

  votes(): Observable<Vote[]> {
    throw new Error('not implemented')
  }

  vote(outcome: Outcome): Operation<void> {
    throw new Error('not implemented')
  }

  stakes(): Observable<Stake[]> {
    throw new Error('not implemented')
  }

  stake(outcome: Outcome, amount: number): Operation<void> {
    throw new Error('not implemented')
  }

  rewards(): Observable<Reward[]> {
    throw new Error('not implemented')
  }
}
