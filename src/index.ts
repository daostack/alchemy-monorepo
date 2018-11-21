import { Observable, of } from 'rxjs'
import { Proposal } from './proposal'
import { Operation } from './operation'
import { DAO } from './dao'
import { DaoQueryOptions } from './types'

export default class Arc {
  graphqlProvider: string
  web3Provider: string

  constructor(options: { graphqlProvider: string; web3Provider: string }) {
    this.graphqlProvider = options.graphqlProvider
    this.web3Provider = options.web3Provider
  }

  /**
   * @return an observable array of DAO instances
   */
  daos(options: DaoQueryOptions): Observable<DAO[]> {
    throw new Error('not implemented')
  }

  /**
   * [dao description]
   * @param  address address of the dao Avatar
   * @return an instance of a DAO
   */
  dao(address: string): DAO {
    return new DAO(address)
  }

  /**
   * An observable of the list of pending operations
   */
  pendingOperations: Observable<Operation<any>[]> = of()
}
