import BN = require('bn.js')
import { Arc } from '../arc'
import { Address } from '../types'
import { NULL_ADDRESS } from '../utils'

export interface IContributionReward {
  beneficiary: Address
  externalTokenReward: BN
  externalToken: Address
  ethReward: BN
  nativeTokenReward: BN
  periods: number
  periodLength: number
  reputationReward: BN
}

export interface IProposalCreateOptions {
  beneficiary: Address
  nativeTokenReward?: BN
  reputationReward?: BN
  ethReward?: BN
  externalTokenReward?: BN
  externalTokenAddress?: Address
  periodLength?: number
  periods?: any
}

export enum IProposalType {
  ContributionReward = 'ContributionReward' // propose a contributionReward
}

// export class Scheme {
//   constructor(public address: Address, version: string, context: Arc) {
//     const abi = context.getABI('ContributionReward', version)
//   }
//   public createProposal(options: IProposalCreateOptions) {
//       const transaction = contributionReward.methods.proposeContributionReward(
//           options.dao,
//           options.descriptionHash || '',
//           options.reputationReward && options.reputationReward.toString() || 0,
//           [
//             options.nativeTokenReward && options.nativeTokenReward.toString() || 0,
//             options.ethReward && options.ethReward.toString() || 0,
//             options.externalTokenReward && options.externalTokenReward.toString() || 0,
//             options.periodLength || 0,
//             options.periods || 1
//           ],
//           options.externalTokenAddress || NULL_ADDRESS,
//           options.beneficiary
//       )
//       return transaction
//   }
//
// }
