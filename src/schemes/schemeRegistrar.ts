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
  scheme?: Address
}
