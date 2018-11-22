import { Observable } from 'rxjs'

export type Address = string
export type Date = number

export interface Stateful<T> {
  state: Observable<T>
}

export interface CommonQueryOptions {
  start?: number
  limit?: number
  orderBy?: string
  orderDirection?: 'ASC' | 'DESC'
}
