import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'

import { Arc } from './arc'
import { DAO } from './dao'
import { Operation } from './operation'
import { IRewardQueryOptions, Reward } from './reward'
import { Address, Date, ICommonQueryOptions, IStateful } from './types'
import { map } from 'rxjs/operators'


export enum ProposalOutcome {
  None,
  Pass,
  Fail
}

export enum ProposalStage {
  Open,
  Boosted,
  QuietEndingPeriod,
  Resolved
}

export interface IProposalState {
  beneficiary: Address
  id: string
  boostedAt: Date
  boostingThreshold: number
  dao: DAO
  proposer: Address
  ipfsHash: string
  title?: string
  description?: string
  url?: string
  createdAt: Date
  ethReward: number,
  executedAt: Date
  externalTokenReward: number,
  quietEndingPeriodBeganAt: Date
  reputationReward: number,
  resolvedAt: Date,
  stage: ProposalStage
  tokensReward: number,
  votesFor: number
  votesAgainst: number
  winningOutcome: ProposalOutcome
  stakesFor: number
  stakesAgainst: number
}

export interface IVote {
  address: Address
  outcome: ProposalOutcome
  amount: number // amount of reputation that was voted with
  proposalId: string
}

export interface IStake {
  address: Address
  outcome: ProposalOutcome
  amount: number // amount staked
  proposalId: string
}

export class Proposal implements IStateful<IProposalState> {
  /**
   * `state` is an observable of the proposal state
   */
  public state: Observable<IProposalState> = of()
  public context: Arc

  constructor(public id: string, context: Arc) {
    this.id = id
    this.context = context
    // TODO: commented out the fields that are (or seem) broken in graphql
    const query = gql`
      {
        proposal (id: "${id}") {
            id,
            dao {
              id
            },
            proposer {
              id
            },
            stage,
            createdAt,
            boostedAt,
            quietEndingPeriodBeganAt,
            executedAt,
            ipfsHash,
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
            preBoostedVoteRequiredPercentage,
            preBoostedVotePeriodLimit,
            boostedVotePeriodLimit,
            thresholdConstA,
            thresholdConstB,
            minimumStakingFee,
            quietEndingPeriod,
            proposingRepRewardConstA,
            proposingRepRewardConstB,
            stakerFeeRatioForVoters,
            votersReputationLossRatio,
            votersGainRepRatioFromLostRep,
            voteOnBehalf,
            beneficiary,
            reputationReward,
            tokensReward,
            ethReward,
            externalTokenReward,
            externalToken,
            periods,
            periodLength
          }
      }
    `

    const itemMap = (item: any): IProposalState => {
      if (item === null) {
        throw Error(`Could not find a Proposal with id '${id}'`)
      }

      // TODO: "pending subgraph implementation" refers to https://github.com/daostack/subgraph/issues/380
      return {
        beneficiary: item.beneficiary,
        boostedAt: item.boostedAt,
        boostingThreshold: 0, // TODO: Pending Subgraph implementation
        createdAt: item.createdAt,
        dao: new DAO(item.dao.id, this.context),
        description: item.description,
        ethReward: item.ethReward, 
        executedAt: item.executedAt,
        externalTokenReward: item.externalTokenReward,
        id: item.id,
        ipfsHash: item.ipfsHash, 
        proposer: item.proposer && item.proposer.id, 
        quietEndingPeriodBeganAt: item.quietEndingPeriodBeganAt,
        reputationReward: item.reputationReward,
        resolvedAt: item.resolvedAt,
        stage: item.stage,
        stakesAgainst: item.stakesAgainst,
        stakesFor: item.stakesFor,
        title: item.title,
        tokensReward: item.tokensReward, 
        url: item.url, 
        votesAgainst: item.votesFor,
        votesFor: item.votesAgainst,
        winningOutcome: item.winningOutcome
      }
    }

    this.state = context._getObservableObject(query, 'proposal', itemMap) as Observable<IProposalState>
  }

  // TODO: probably does not need to be an observable, as it never changes
  public dao(): Observable<DAO> {
    return this.state.pipe(
      map((state) => {
        return state.dao
      })
    )
  }

  public votes(options: IVoteQueryOptions = {}): Observable<IVote[]> {
    throw new Error('not implemented')
    // return this.dao().pipe(
    //   switchMap((dao) => {
    //     return dao.votes({ ...options, proposalId: this.id })
    //   })
    // )
  }

  public vote(outcome: ProposalOutcome): Operation<void> {
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

  public stake(outcome: ProposalOutcome, amount: number): Operation<void> {
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

  // private getProposalStage(state: number, executionState: number, decision: number): ProposalStage {
  //   if (state === 3 && executionState === 0) {
  //     return ProposalStage.preboosted
  //   } else if (state === 4 && executionState === 0) {
  //     return ProposalStage.boosted
  //   } else if (state === 5 && executionState === 0) {
  //     return ProposalStage.overtimed
  //   } else if (state === 2 && executionState === 2) {
  //     return ProposalStage.passed
  //   } else if (state === 2 && (executionState === 3 || executionState === 4) && decision === 1) {
  //     return ProposalStage.passedBoosted
  //   } else if ((state === 1 || state === 2) && (executionState === 1 || executionState === 2) && decision === 2) {
  //     return ProposalStage.failed
  //   } else if ((state === 1 || state === 2) && (executionState === 3 || executionState === 4) && decision === 2) {
  //     return ProposalStage.failedBoosted
  //   }
  //
  //   return ProposalStage.preboosted
  // }
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
  [key: string]: any
}

export interface IVoteQueryOptions extends ICommonQueryOptions {
  proposalId?: string
}

export interface IStakeQueryOptions extends ICommonQueryOptions {
  proposalId?: string
}
