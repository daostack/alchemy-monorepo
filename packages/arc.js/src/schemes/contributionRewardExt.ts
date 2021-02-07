import BN = require('bn.js')
import { Arc } from '../arc'
import { IProposalBaseCreateOptions, Proposal } from '../proposal'
import { Address } from '../types'
import { NULL_ADDRESS } from '../utils'

// // this interface is not used - it is conflated with IContributionReward
export interface IContributionRewardExt {
  beneficiary: Address
  externalTokenReward: BN
  externalToken: Address
  ethReward: BN
  nativeTokenReward: BN
  periods: number
  periodLength: number
  reputationReward: BN
  alreadyRedeemedNativeTokenPeriods: number
  alreadyRedeemedReputationPeriods: number
  alreadyRedeemedExternalTokenPeriods: number
  alreadyRedeemedEthPeriods: number
  reputationChangeLeft: BN
  nativeTokenRewardLeft: BN
  ethRewardLeft: BN
  externalTokenRewardLeft: BN
}

export interface IProposalCreateOptionsContributionRewardExt extends IProposalBaseCreateOptions {
  beneficiary: Address
  nativeTokenReward?: BN
  reputationReward?: BN
  ethReward?: BN
  externalTokenReward?: BN
  externalTokenAddress?: Address
  proposer: Address
}

export enum IProposalType {
  ContributionReward = 'ContributionRewardExt' // propose a contributionReward
}

/**
 *
 * @param options
 * @param context
 */
export function createProposal(options: any, context: Arc) {
  const contract = context.getContract(options.scheme)
  if (!options.proposer) {
    options.proposer = NULL_ADDRESS
  }
  return async () => {
    options.descriptionHash = await context.saveIPFSData(options)
    const transaction = contract.methods.proposeContributionReward(
        options.descriptionHash || '',
        options.reputationReward && options.reputationReward.toString() || 0,
        [
          options.nativeTokenReward && options.nativeTokenReward.toString() || 0,
          options.ethReward && options.ethReward.toString() || 0,
          options.externalTokenReward && options.externalTokenReward.toString() || 0
        ],
        options.externalTokenAddress || NULL_ADDRESS,
        options.beneficiary,
        options.proposer
    )
    return transaction
  }
}

export function createTransactionMap(options: any, context: Arc) {
  const eventName = 'NewContributionProposal'
  const map = (receipt: any) => {
    const proposalId = receipt.events[eventName].returnValues._proposalId
    return new Proposal(proposalId, context)
  }
  return map
}
