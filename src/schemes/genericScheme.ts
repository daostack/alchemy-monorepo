import { Address } from '../types'

export interface IGenericScheme {
  id: string
  contractToCall: Address
  callData: string
  executed: boolean
  returnValue: string
}

export interface IProposalCreateGenericSchemeOptions {
  callData?: string
  value?: number
}
