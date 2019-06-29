import { Observable } from 'rxjs'

export type Address = string
export type Date = number
export type Hash = string
export type Web3Receipt = any
export type Web3Provider = string | object

export interface IStateful<T> {
  state: () => Observable<T>
}

export interface ICommonQueryOptions {
  skip?: number
  first?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
  where?: any
}

export type IPFSProvider = string| { host: string, protocol?: string, port?: string, apiPath?: string}
