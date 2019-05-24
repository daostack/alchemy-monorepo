import { Arc } from '../arc'
import { Proposal } from '../proposal'
import { Address } from '../types'

export interface IGenericScheme {
  id: string
  contractToCall: Address
  callData: string
  executed: boolean
  returnValue: string
}

export interface IProposalCreateOptions {
  callData?: string
  value?: number
}
export enum IProposalType {
  GenericScheme = 'GenericScheme' // propose a contributionReward
}

export function createTransaction(options: any, context: Arc) {
  if (!options.callData) {
    throw new Error(`Missing argument "callData" for GenericScheme in Proposal.create()`)
  }
  if (options.value === undefined) {
    throw new Error(`Missing argument "value" for GenericScheme in Proposal.create()`)
  }
  return async () => {
    options.descriptionHash = await context.saveIPFSData(options)

    const genericScheme = context.getContract(options.scheme)
    const transaction = genericScheme.methods.proposeCall(
      options.dao,
      options.callData,
      options.value,
      options.descriptionHash
    )
    return transaction
  }
}

export function createTransactionMap(options: any, context: Arc) {
  const eventName = 'NewCallProposal'
  const map = (receipt: any) => {
    const proposalId = receipt.events[eventName].returnValues._proposalId
    const votingMachineAddress = receipt.events[eventName].returnValues._intVoteInterface
    return new Proposal(proposalId, options.dao as string, options.scheme, votingMachineAddress, context)
  }
  return map
}
