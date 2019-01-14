import gql from 'graphql-tag'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { Arc } from './arc'
import { Proposal } from './proposal'
import { Address, ICommonQueryOptions, IStateful } from './types'

export enum RewardType {
  Reputation,
  Token,
  ETH,
  External
}

export enum RewardReason {
  Contribution,
  Proposer,
  Voter,
  Staker,
  Bounty
}

export interface IRewardState {
  id: string
  // createdAt: number
  beneficiary: Address
  createdAt: Date
  proposal: Proposal
  reason: RewardReason,
  type: RewardType
  tokenAddress: Address,
  amount: number,
  redeemed: number
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
        createdAt
        dao {
          id
        }
        member {
          id
        }
        reason
        amount
        proposal {
           id
         }
        redeemed
        tokenAddress
        type
      }
    } `

    const itemMap = (item: any): IRewardState => {
      return {
        amount: Number(item.amount),
        beneficiary: item.member.id,
        createdAt: item.createdAt,
        id: item.id,
        proposal: new Proposal(item.proposal.id, context),
        reason: item.reason,
        redeemed: Number(item.redeemed),
        tokenAddress: item.tokenAddress,
        type: item.type
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
