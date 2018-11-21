import { Observable } from 'rxjs'

export interface Stateful<T> {
  state: Observable<T>
}

export interface CommonQueryOptions {
  start: number
  limit: number
  orderBy: string
  orderDirection: 'ASC' | 'DESC'
}

export interface DaoQueryOptions extends CommonQueryOptions {
  address: string
  name: string
}

export interface ProposalQueryOptions extends CommonQueryOptions {
  active: boolean
  boosted: boolean
}

export interface RewardQueryOptions extends CommonQueryOptions {}

export interface VoteQueryOptions extends CommonQueryOptions {}

export interface StakeQueryOptions extends CommonQueryOptions {}
