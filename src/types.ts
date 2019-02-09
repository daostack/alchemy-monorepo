import { Observable } from 'rxjs'

export type Address = string
export type Date = number
export type Hash = string
export type Web3Receipt = any

export interface IStateful<T> {
  state: Observable<T>
}

export interface ICommonQueryOptions {
  start?: number
  limit?: number
  orderBy?: string
  orderDirection?: 'ASC' | 'DESC'
}
