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

    // need to get the votingMachineAddress from the contract, as it is not in the events
    // TODO: this code can be considerably simplified if/when https://github.com/daostack/arc/issues/637 is resolved
    const schemeContract = context.getContract(options.scheme)
    const schemeContractInfo = context.getContractInfo(options.scheme)
    const avatarAddress = receipt.events[eventName].returnValues._avatar
    const avatarContract = context.getContract(avatarAddress, 'Avatar', schemeContractInfo.version)
    const controllerAddress = await avatarContract.methods.owner().call()
    const controllerContract = context.getContract(controllerAddress)
    const parametersHash = await controllerContract.methods.getSchemeParameters(options.scheme, avatarAddress).call()
    const parameters = await schemeContract.methods.parameters(parametersHash).call()
    const votingMachineAddress = parameters.intVote
    return new Proposal(proposalId, options.dao as string, options.scheme, votingMachineAddress, context)
  }
  return map
}
