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
  | { open: true }
  // boosted
  | { boosted: true; boostedAt: number }
  // quiet ending
  | { overtimed: true; boostedAt: number; overtimedAt: number }
  // passed in pre boosted phase (via absolute vote)
  | { passed: true; executedAt: number }
  // passed in boosted phase
  | { passed: true; executedAt: number; boosted: true; boostedAt: number; overtimedAt?: number }
  // failed in pre boosted phase
  | { failed: true }
  // failed in boosted phase
  | { failed: true; boosted: true; boostedAt: number }

export interface ProposalState {
  id: string
  createdAt: number
  dao: string
  proposer: string
  stage: ProposalStage

  ipfsHash: string
  title?: string
  description?: string
  url?: string

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

interface Vote {
  address: string
  outcome: Outcome
}
interface Stake {
  address: string
  outcome: Outcome
  amount: string
}

export class Proposal implements Stateful<ProposalState> {
  /**
   * `state` is an observable of the proposal state
   */
  state: Observable<ProposalState> = of()
  constructor(private id: string) {}

  votes(): Observable<Vote[]> {
    throw new Error('not implmented')
  }

  vote(outcome: Outcome): Operation<void> {
    throw new Error('not implmented')
  }

  stakes(): Observable<Stake[]> {
    throw new Error('not implmented')
  }

  stake(outcome: Outcome, amount: number): Operation<void> {
    throw new Error('not implmented')
  }

  rewards(): Observable<Reward> {
    throw new Error('not implemented')
  }
}
