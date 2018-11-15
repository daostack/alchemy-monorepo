import { Stateful } from './types'
import { of, Observable } from 'rxjs'

export enum RewardType {
  Contribution,
  Proposer,
  Staker,
  Voter,
  Bounty
}

interface RewardState {
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

export class Reward implements Stateful<RewardState> {
  public state: Observable<RewardState> = of()
  constructor(private id: string) {}
}
