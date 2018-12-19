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
  quietEndingPeriodBeganAt: Date
  // date when the proposal is executed, null if not executed yet
  executedAt: Date
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
    // TODO: commented out the fields that are (or seem) broken in graphql
    const query = gql`
      {
        proposal (id: "${id}") {
            id,
            dao {
              id
            },
            # proposer {
            #  id
            # },
            stage,
            # createdAt,
            boostedAt,
            quietEndingPeriodBeganAt,
            executedAt,
            # ipfsHash,
            title,
            description,
            url,
            rewards {
              id
            },
            votes {
              id
            },
            votesFor,
            votesAgainst,
            winningOutcome,
            stakes {
              id
            },
            stakesFor,
            stakesAgainst,
            # preBoostedVoteRequiredPercentage,
            # preBoostedVotePeriodLimit,
            # boostedVotePeriodLimit,
            # thresholdConstA,
            # thresholdConstB,
            # minimumStakingFee,
            # quietEndingPeriod,
            # proposingRepRewardConstA,
            # proposingRepRewardConstB,
            # stakerFeeRatioForVoters,
            # votersReputationLossRatio,
            # votersGainRepRatioFromLostRep,
            # voteOnBehalf,
            # beneficiary,
            # reputationReward,
            # tokensReward,
            # ethReward,
            # externalTokenReward,
            # externalToken,
            # periods,
            # periodLength
          }
      }
    `

    const itemMap = (item: any): IProposalState => {
      if (item === null) {
        throw Error(`Could not find a Proposal with id '${id}'`)
      }

      return {
        boostedAt: item.boostedAt,
        boostingThreshold: 0, // TODO: Pending Subgraph implementation
        // createdAt: item.createdAt,
        createdAt: item.createdAt, // TODO: Pending Subgraph implementation
        dao: item.dao.id,
        description: item.description, // TODO: Pending Subgraph implementation
        executedAt: item.executedAt,
        id: item.id,
        ipfsHash: item.ipfsHash, // TODO: Pending Subgraph implementation
        proposer: item.proposer && item.proposer.id, // TODO: pending subgraph implementation
        quietEndingPeriodBeganAt: item.quietEndingPeriodBeganAt,
        // resolvesAt: 0, // TODO: Pending Subgraph implementation
        stage: item.stage,
        stakesAgainst: item.stakesAgainst,
        stakesFor: item.stakesFor,
        title: item.title, // TODO: Pending Subgraph implementation
        url: item.url, // TODO: Pending Subgraph implementation
        votesAgainst: item.votesFor,
        votesFor: item.votesAgainst,
        winningOutcome: item.winningOutcome
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
