import { ProposalOutcome} from './proposal'
import { Address, ICommonQueryOptions } from './types'

export interface IStakeQueryOptions extends ICommonQueryOptions {
  proposalId?: string
  [key: string]: any
}

export interface IStake {
  address: Address
  outcome: ProposalOutcome
  amount: number // amount staked
  proposalId: string
}
