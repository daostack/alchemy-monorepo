import { Address } from '../types'

export interface IGenericScheme {
  id: string
  contractToCall: Address
  callData: string
  executed: boolean
  returnValue: string
}

export interface IProposalCreateOptions {
  callData: string
  value: number
}
export enum IProposalType {
  GenericScheme = 'GenericScheme' // propose a contributionReward
}
