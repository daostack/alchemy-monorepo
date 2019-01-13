import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'
import { Arc } from './arc'
import { Proposal } from './proposal'
import { Address, ICommonQueryOptions, IStateful } from './types'

export enum RewardType {
  Contribution,
  Proposer,
  Staker,
  Voter,
  Bounty
}

export interface IRewardState {
  id: string
  // createdAt: number
  contract: Address
  beneficiary: string
  ethReward: number
  executedAt: number
  externalTokenReward: number
  nativeTokenReward: number
  periods: number
  periodLength: number
  proposal: Proposal
  reputationReward: number
  type: RewardType
}

export class Reward implements IStateful<IRewardState> {
  public state: Observable<IRewardState> = of()

  constructor(public id: string, public context: Arc) {
    const query = gql`{
      reward (id: "${id}") {
        id
        dao {
          id
        }
        type
        member {
          id
        }
        reason
        amount
        proposal {
          id
        }
        redeemed
        createdAt
        tokenAddress
      }
    } `

    const itemMap = (item: any): IRewardState => {
      if (item === null) {
        throw Error(`Could not find a Reward with id '${id}'`)
      }

      return {
        beneficiary: item.beneficiary,
        contract: item.contract,
        ethReward: item.ethReward, // TODO: pending..
        executedAt: item.executedAt,
        externalTokenReward: item.externalTokenReward,
        id: item.id,
        nativeTokenReward: item.nativeTokenReward,
        periodLength: item.periodLength,
        periods: item.periods,
        proposal: new Proposal(item.proposalId, this.context),
        reputationReward: item.reputationReward ,
        type: RewardType.Contribution
      }
    }

    this.state = context._getObservableObject(query, 'proposal', itemMap) as Observable<IRewardState>

  }
}

export interface IRewardQueryOptions extends ICommonQueryOptions {
  proposalId?: string
  beneficiary?: Address
  createdAtAfter?: Date
  createdAtBefore?: Date
  [id: string]: any
}
