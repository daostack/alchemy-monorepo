import BN = require('bn.js')
import { Arc } from '../arc'
import { Proposal } from '../proposal'
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

export interface IProposalCreateOptionsCR {
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

export function createTransaction(options: any, context: Arc) {
  const contributionReward = context.getContract(options.scheme)

  return async () => {
    options.descriptionHash = await context.saveIPFSData(options)
    const transaction = contributionReward.methods.proposeContributionReward(
        options.dao,
        options.descriptionHash || '',
        options.reputationReward && options.reputationReward.toString() || 0,
        [
          options.nativeTokenReward && options.nativeTokenReward.toString() || 0,
          options.ethReward && options.ethReward.toString() || 0,
          options.externalTokenReward && options.externalTokenReward.toString() || 0,
          options.periodLength || 0,
          options.periods || 1
        ],
        options.externalTokenAddress || NULL_ADDRESS,
        options.beneficiary
    )
    return transaction
  }
}

export function createTransactionMap(options: any, context: Arc) {
  const eventName = 'NewContributionProposal'
  const map = (receipt: any) => {
    const proposalId = receipt.events[eventName].returnValues._proposalId
    const votingMachineAddress = receipt.events[eventName].returnValues._intVoteInterface
    return new Proposal(proposalId, options.dao as string, options.scheme, votingMachineAddress, context)
  }
  return map
}
