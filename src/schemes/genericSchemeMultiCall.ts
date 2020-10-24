import BN = require('bn.js')
import { Arc } from '../arc'
import { Proposal } from '../proposal'
import { Address } from '../types'

export interface IGenericSchemeMultiCallInfo {
  id: string
  schemeConstraints: Address
  contractsWhiteList: Address[]
  votingMachine: Address
}

export interface IGenericSchemeMultiCall {
  id: string
  contractsToCall: Address[]
  callsData: string[]
  executed: boolean
  returnValues: string[]
  values: BN[]
}

export interface IProposalCreateOptionsGSMultiCall {
  contractsToCall?: Address[]
  callsData?: string[]
  values?: BN[]
}

export enum IProposalType {
  GenericSchemeMultiCall = 'GenericSchemeMultiCall'
}

export function createTransaction(options: any, context: Arc) {
  if (!options.callsData) {
    throw new Error(`Missing argument "callsData" for GenericSchemeMultiCall in Proposal.create()`)
  }
  if (options.values === undefined) {
    throw new Error(`Missing argument "values" for GenericSchemeMultiCall in Proposal.create()`)
  }
  return async () => {
    options.descriptionHash = await context.saveIPFSData(options)

    const genericSchemeMultiCall = context.getContract(options.scheme)
    const transaction = genericSchemeMultiCall.methods.proposeCalls(
      options.contractsToCall,
      options.callsData,
      options.values,
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
