import { Arc } from '../arc'
import { Proposal } from '../proposal'
import { Address } from '../types'

export interface ISchemeRegistrar {
  id: string
  schemeToRegister: Address
  schemeToRegisterParamsHash: string
  schemeToRegisterPermission: string
  schemeToRemove: string
  decision: number
  schemeRegistered: boolean
  schemeRemoved: boolean
}

export interface IProposalCreateOptions {
  parametersHash?: string
  permissions?: string
  schemeToRegister?: Address
}

export enum IProposalType {
  SchemeRegistrarAdd = 'SchemeRegistrarAdd', // propose to register to schme
  SchemeRegistrarEdit = 'SchemeRegistrarEdit', // propose to edit a registered scheme
  SchemeRegistrarRemove = 'SchemeRegistrarRemove' // propose to remove a registered scheme
}

export function createTransaction(options: any, context: Arc): () => any {
  let msg: string
  switch (options.type) {
    case IProposalType.SchemeRegistrarAdd:
    case IProposalType.SchemeRegistrarEdit:
     if (!options.scheme) {
        msg = `Missing argument "scheme" for SchemeRegistrar in Proposal.create()`
        throw Error(msg)
      }
     if (!options.parametersHash) {
        msg = `Missing argument "parametersHash" for SchemeRegistrar in Proposal.create()`
        throw Error(msg)
      }
     if (!options.permissions) {
        msg = `Missing argument "permissions" for SchemeRegistrar in Proposal.create()`
        throw Error(msg)
      }
     return async () => {
        const schemeRegistrar = context.getContract(options.scheme)
        options.descriptionHash = await context.saveIPFSData(options)

        const transaction = schemeRegistrar.methods.proposeScheme(
          options.dao,
          options.schemeToRegister,
          options.parametersHash,
          options.permissions,
          options.descriptionHash
        )
        return transaction
      }
    case 'SchemeRegistrarRemove':
     if (!options.scheme) {
        msg = `Missing argument "scheme" for SchemeRegistrar`
        throw Error(msg)
     }
     return async () => {
        const schemeRegistrar = context.getContract(options.scheme)
        options.descriptionHash = await context.saveIPFSData(options)
        const transaction = schemeRegistrar.methods.proposeToRemoveScheme(
          options.dao,
          options.schemeToRegister,
          options.descriptionHash
        )
        return transaction
      }
  }
  throw Error('For a schemeregistrar proposal, you must specifcy proposal.type')
}

export function createTransactionMap(options: any, context: Arc) {
  let eventName: string
  switch (options.type) {
    case IProposalType.SchemeRegistrarAdd:
    case IProposalType.SchemeRegistrarEdit:
       eventName = 'NewSchemeProposal'
       break
    case 'SchemeRegistrarRemove':
       eventName = 'RemoveSchemeProposal'
  }
  const map = (receipt: any) => {
    const proposalId = receipt.events[eventName].returnValues._proposalId
    const votingMachineAddress = receipt.events[eventName].returnValues._intVoteInterface
    return new Proposal(proposalId, options.dao as string, options.scheme, votingMachineAddress, context)
  }
  return map
}
