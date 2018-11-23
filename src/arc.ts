import { Observable, of } from 'rxjs'
import { DAO, IDaoQueryOptions } from './dao'
import { Operation } from './operation'
import { Proposal } from './proposal'
import { Address } from './types'

export class Arc {
  public graphqlProvider: string
  public web3Provider: string
  public pendingOperations: Observable<Array<Operation<any>>> = of()

  constructor(options: { graphqlProvider: string; web3Provider: string }) {
    this.graphqlProvider = options.graphqlProvider
    this.web3Provider = options.web3Provider
  }

  /**
   * @return an observable array of DAO instances
   */
  public daos(options: IDaoQueryOptions = {}): Observable<DAO[]> {
    throw new Error('not implemented')
  }

  /**
   * [dao description]
   * @param  address address of the dao Avatar
   * @return an instance of a DAO
   */
  public dao(address: Address): DAO {
    return new DAO(address)
  }

  /**
   * An observable of the list of pending operations
   */
}
