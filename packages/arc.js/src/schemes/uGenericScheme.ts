import BN = require('bn.js')
import { Arc } from '../arc'
import { Proposal } from '../proposal'
import { Address } from '../types'

export interface IUGenericSchemeInfo {
  id: string
  contractToCall: Address
  votingMachine: Address
}

export interface IUGenericScheme {
  id: string
  contractToCall: Address
  callData: string
  executed: boolean
  returnValue: string
}

export interface IProposalCreateOptionsGS {
  callData?: string
  value?: BN | number | string
}
export enum IProposalType {
  GenericScheme = 'UGenericScheme'
}

export function createTransaction(options: any, context: Arc) {
  if (!options.callData) {
    throw new Error(`Missing argument "callData" for UGenericScheme in Proposal.create()`)
  }
  if (options.value === undefined) {
    throw new Error(`Missing argument "value" for UGenericScheme in Proposal.create()`)
  }
  return async () => {
    options.descriptionHash = await context.saveIPFSData(options)

    const genericScheme = context.getContract(options.scheme)
    const transaction = genericScheme.methods.proposeCall(
      options.dao,
      options.callData,
      options.value.toString(),
      options.descriptionHash
    )
    return transaction
  }
}

/**
 * map the transaction receipt of the createTransaction call to a nice result
 * @param  options  the options passed to the createProposal call
 * @param  context an Arc instance
 * @return         [description]
 */
export function createTransactionMap(options: any, context: Arc) {
  const eventName = 'NewCallProposal'
  const map = async (receipt: any) => {
    const proposalId = receipt.events[eventName].returnValues._proposalId
    return new Proposal(proposalId, context)
  }
  return map
}
