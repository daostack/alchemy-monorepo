import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

import { Arc } from './arc'
import { DAO } from './dao'
import { Operation } from './operation'
import { IRewardQueryOptions, Reward } from './reward'
import { Address, Date, ICommonQueryOptions, IStateful } from './types'
import { IVote } from './vote'

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
  id: string
  beneficiary: Address
  boostedAt: Date
  boostingThreshold: number
  boostedVotePeriodLimit: number
  createdAt: Date
  dao: DAO
  description?: string
  ethReward: number,
  executedAt: Date
  externalTokenReward: number,
  ipfsHash: string
  preBoostedVotePeriodLimit: number,
  proposer: Address
  quietEndingPeriodBeganAt: Date
  reputationReward: number,
  resolvedAt: Date,
  stage: ProposalStage
  stakesFor: number
  stakesAgainst: number
  title?: string
  url?: string
  tokensReward: number,
  votesFor: number
  votesAgainst: number
  winningOutcome: ProposalOutcome
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

    const query = gql`
      {
        proposal(id: "${id}") {
          id
          dao {
            id
          }
          proposer {
            id
          }
          stage
          createdAt
          boostedAt
          quietEndingPeriodBeganAt
          executedAt
          ipfsHash
          title
          description
          url
          rewards {
            id
          }
          votes {
            id
          }
          votesFor
          votesAgainst
          winningOutcome
          stakes {
            id
          }
          stakesFor
          stakesAgainst
          queuedVoteRequiredPercentage
          queuedVotePeriodLimit
          boostedVotePeriodLimit
          preBoostedVotePeriodLimit
          thresholdConst
          limitExponentValue
          quietEndingPeriod
          proposingRepReward
          minimumStakingFee
          # votersReputationLossRatio FIXME
          minimumDaoBounty
          daoBountyConst
          activationTime
          voteOnBehalf
          beneficiary
          reputationReward
          tokensReward
          ethReward
          externalTokenReward
          externalToken
          periods
          periodLength
        }
      }
    `

    const itemMap = (item: any) => {
      if (item === null) {
        throw Error(`Could not find a Proposal with id '${id}'`)
      }

      return {
        beneficiary: item.beneficiary,
        boostedAt: Number(item.boostedAt),
        boostedVotePeriodLimit: Number(item.boostedVotePeriodLimit),
        boostingThreshold: 0, // TODO:
        createdAt: Number(item.createdAt),
        dao: new DAO(item.dao.id, this.context),
        description: item.description,
        ethReward: Number(item.ethReward),
        executedAt: item.executedAt,
        externalTokenReward: Number(item.externalTokenReward),
        id: item.id,
        ipfsHash: item.ipfsHash,
        preBoostedVotePeriodLimit: Number(item.preBoostedVotePeriodLimit),
        proposer: item.proposer && item.proposer.id,
        quietEndingPeriodBeganAt: item.quietEndingPeriodBeganAt,
        reputationReward: Number(item.reputationReward),
        resolvedAt: item.resolvedAt !== undefined ? Number(item.resolvedAt) : null,
        stage: item.stage,
        stakesAgainst: Number(item.stakesAgainst),
        stakesFor: Number(item.stakesFor),
        title: item.title,
        tokensReward: Number(item.tokensReward),
        url: item.url,
        votesAgainst: item.votesFor,
        votesFor: item.votesAgainst,
        winningOutcome: item.winningOutcome
      }
    }

    this.state = context._getObservableObject(query, 'proposal', itemMap) as Observable<IProposalState>
  }

  public dao(): Observable<DAO> {
    return this.state.pipe(
      map((state) => {
        return state.dao
      })
    )
  }

  public votes(options: IVoteQueryOptions = {}): Observable < IVote[] > {
    return this.dao().pipe(
      switchMap((dao) => {
        options.proposal = this.id
        return dao.votes(options)
    }))
  }

  public vote(outcome: ProposalOutcome): Operation < void > {
    throw new Error('not implemented')
  }

  public stakes(options: IStakeQueryOptions = {}): Observable < IStake[] > {
    throw new Error('not implemented')
    // return this.dao().pipe(
    //   switchMap((dao) => {
    //     return dao.stakes({ ...options, proposalId: this.id })
    //   })
    // )
  }

  public stake(outcome: ProposalOutcome, amount: number): Operation < void > {
    throw new Error('not implemented')
  }

  public rewards(options: IRewardQueryOptions = {}): Observable < Reward[] > {
    throw new Error('not implemented')
    // return this.dao().pipe(
    //   switchMap((dao) => {
    //     return dao.rewards({ ...options, proposalId: this.id })
    //   })
    // )
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
  [key: string]: any
}

export interface IVoteQueryOptions extends ICommonQueryOptions {
  member?: Address
  proposal?: string
  [key: string]: any
}

export interface IStakeQueryOptions extends ICommonQueryOptions {
  proposalId?: string
  [key: string]: any
}
