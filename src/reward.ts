import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
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

export interface IRewardQueryOptions extends ICommonQueryOptions {
  proposal?: string
  // TODO: beneficiary is not a field on Reward - see issue https://github.com/daostack/subgraph/issues/60
  // beneficiary?: Address
  createdAtAfter?: Date
  createdAtBefore?: Date
  [id: string]: any
}

export class Reward implements IStateful<IRewardState> {

  public static search(context: Arc, options: IRewardQueryOptions) {
    let where = ''
    for (const key of Object.keys(options)) {
      if (where !== '') { where += ',\n'}
      where += `${key}: "${options[key] as string}"`
    }

    const query = gql`{
      rewards (where: {${where}}) {
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
        proposal: new Proposal(item.proposalId, context),
        reputationReward: item.reputationReward ,
        type: RewardType.Contribution
      }
    }

    return context._getObservableList(query, itemMap) as Observable<IRewardState[]>
  }

  public state: Observable<IRewardState> = of()

  constructor(public id: string, public context: Arc) {
    this.id = id
    this.context = context
    this.state = Reward.search(this.context, {id: this.id}).pipe(
      map((rewards) => {
        if (rewards.length === 0) {
          throw Error(`No rewards with id ${this.id} found`)
        } else if (rewards.length > 1) {
          throw Error(`This should never happen`)
        } else {
          return rewards[0]
        }
      })
    )
  }
}
