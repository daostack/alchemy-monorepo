import { Observable, of } from 'rxjs'
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
  createdAt: number
  dao: string
  beneficiary: string
  proposalId: string
  type: RewardType
  rewards: {
    reputation: {
      total: number
      redeemed: number
      redeemable: number
    }
    tokens: {
      total: number
      redeemed: number
      redeemable: number
    }
    eth: {
      total: number
      redeemed: number
      redeemable: number
    }
    external: {
      token: string
      total: number
      redeemed: number
      redeemable: number
    }
  }
}

export class Reward implements IStateful<IRewardState> {
  public state: Observable<IRewardState> = of()
  constructor(private id: string) {}
}

export interface IRewardQueryOptions extends ICommonQueryOptions {
  proposalId?: string
  beneficiary?: Address
  createdAtAfter?: Date
  createdAtBefore?: Date
}
