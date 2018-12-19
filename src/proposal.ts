import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

import { Arc } from './arc'
import { DAO } from './dao'
import { Operation } from './operation'
import { IRewardQueryOptions, Reward } from './reward'
import { Address, Date, ICommonQueryOptions, IStateful } from './types'
import * as utils from './utils'

export enum Outcome {
  None,
  Pass,
  Fail
}

export enum ProposalStage {
  // pre boosted
  // | { open: true }
  preboosted, // ProposalState: 3, ExecutionState: 0
  // boosted
  // | { boosted: true; boostedAt: number }
  boosted, // ProposalState: 4, ExecutionState: 0
  // quiet ending
  // | { overtimed: true; boostedAt: number; overtimedAt: number }
  overtimed, // ProposalState: 5, ExecutionState: 0
  // passed in pre boosted phase (via absolute IVote)
  // | { passed: true; executedAt: number }
  passed, // ProposalState: 2, ExecutionState: 2
  // passed in boosted phase
  // | { passed: true; executedAt: number; boosted: true; boostedAt: number; overtimedAt?: number }
  passedBoosted, // ProposalState: 2, ExecutionState: 4
  // failed in pre boosted phase
  // | { failed: true }
  failed, // ProposalState: 1 or 2, ExecutionState: 1 or 2, decision: 0
  // failed in boosted phase
  // | { failed: true; boosted: true; boostedAt: number }
  failedBoosted // 1 or 2, ExecutionState: 3 or 4, decision: 0
}

export interface IProposalState {
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
}

export interface IVote {
  address: Address
  outcome: Outcome
  amount: number // amount of reputation that was voted with
  proposalId: string
}

export interface IStake {
  address: Address
  outcome: Outcome
  amount: number // amount staked
  proposalId: string
}

export class Proposal implements IStateful<IProposalState> {
  /**
   * `state` is an observable of the proposal state
   */
  public state: Observable<IProposalState> = of()

  constructor(public id: string, context: Arc) {
    this.id = id
    const query = gql`
      {
        proposal (id: "${id}") {
          id
          submittedTime
          proposer
          daoAvatarAddress
          numOfChoices
          decision
          executionTime
          totalReputation
          executionState
          state
        }
      }
    `
    const itemMap = (item: any): IProposalState => {
      if (item === null) {
        throw Error(`Could not find a Proposal with id ${id}`)
      }

      return {
        boostedAt: 0, // TODO: Pending Subgraph implementation
        boostingThreshold: 0, // TODO: Pending Subgraph implementation
        createdAt: item.submittedTime,
        dao: item.daoAvatarAddress,
        description: '', // TODO: Pending Subgraph implementation
        executedAt: item.executionTime,
        id: item.id,
        ipfsHash: '', // TODO: Pending Subgraph implementation
        overtimedAt: 0, // TODO: Pending Subgraph implementation
        proposer: item.proposer,
        resolvesAt: 0, // TODO: Pending Subgraph implementation
        stage: this.getProposalStage(item.state, item.executionState, item.decision),
        stakesAgainst: 0, // TODO: Pending Subgraph implementation
        stakesFor: 0, // TODO: Pending Subgraph implementation
        title: '', // TODO: Pending Subgraph implementation
        url: '', // TODO: Pending Subgraph implementation
        votesAgainst: 0, // TODO: Pending Subgraph implementation
        votesFor: 0, // TODO: Pending Subgraph implementation
        winningOutcome: item.decision
      }
    }

    this.state = context._getObjectObservable(query, 'proposal', itemMap) as Observable<IProposalState>
  }

  // TODO: probably does not need to be an observable, as it never changes
  public dao(): Observable<DAO> {
    throw new Error('not implemented')
    // return this.state.pipe(
    //   map((state) => {
    //     return new DAO(state.dao)
    //   })
    // )
  }

  public votes(options: IVoteQueryOptions = {}): Observable<IVote[]> {
    throw new Error('not implemented')
    // return this.dao().pipe(
    //   switchMap((dao) => {
    //     return dao.votes({ ...options, proposalId: this.id })
    //   })
    // )
  }

  public vote(outcome: Outcome): Operation<void> {
    throw new Error('not implemented')
  }

  public stakes(options: IStakeQueryOptions = {}): Observable<IStake[]> {
    throw new Error('not implemented')
    // return this.dao().pipe(
    //   switchMap((dao) => {
    //     return dao.stakes({ ...options, proposalId: this.id })
    //   })
    // )
  }

  public stake(outcome: Outcome, amount: number): Operation<void> {
    throw new Error('not implemented')
  }

  public rewards(options: IRewardQueryOptions = {}): Observable<Reward[]> {
    throw new Error('not implemented')
    // return this.dao().pipe(
    //   switchMap((dao) => {
    //     return dao.rewards({ ...options, proposalId: this.id })
    //   })
    // )
  }

  private getProposalStage(state: number, executionState: number, decision: number): ProposalStage {
    if (state === 3 && executionState === 0) {
      return ProposalStage.preboosted
    } else if (state === 4 && executionState === 0) {
      return ProposalStage.boosted
    } else if (state === 5 && executionState === 0) {
      return ProposalStage.overtimed
    } else if (state === 2 && executionState === 2) {
      return ProposalStage.passed
    } else if (state === 2 && (executionState === 3 || executionState === 4) && decision === 1) {
      return ProposalStage.passedBoosted
    } else if ((state === 1 || state === 2) && (executionState === 1 || executionState === 2) && decision === 2) {
      return ProposalStage.failed
    } else if ((state === 1 || state === 2) && (executionState === 3 || executionState === 4) && decision === 2) {
      return ProposalStage.failedBoosted
    }

    return ProposalStage.preboosted
  }
}

enum ProposalQuerySortOptions {
  resolvesAt = 'resolvesAt'
  // 'resolvesAt' should be ok for the current alchemy; will add more options as needed.
}

export interface IProposalQueryOptions extends ICommonQueryOptions {
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

export interface IVoteQueryOptions extends ICommonQueryOptions {
  proposalId?: string
}

export interface IStakeQueryOptions extends ICommonQueryOptions {
  proposalId?: string
}
