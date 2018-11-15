import { Observable, of } from 'rxjs'
import { Proposal } from './proposal'
import { Operation } from './operation'
import { DAO } from './dao'

export default class Arc {
  constructor(private graphqlProvider: string, private web3Provider: string) {}

  daos(): Observable<DAO[]> {
    throw new Error('not implmented')
  }

  dao(address: string): DAO {
    return new DAO(address)
  }

  /**
   * An observable of the list of pending operations
   */
  pendingOperations: Observable<Operation<any>[]> = of()
}
