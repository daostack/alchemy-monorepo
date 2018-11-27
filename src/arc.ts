import Avatar from '@daostack/arc/build/contracts/Avatar.json'
import { ApolloClient } from 'apollo-client'
import { Observable as ZenObservable } from 'apollo-link'
import gql from 'graphql-tag'
import { from, Observable, Observer, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { DAO, IDaoQueryOptions } from './dao'
import { Operation } from './operation'
import { Proposal } from './proposal'
import { Address } from './types'
import * as utils from './utils'

export class Arc {
  public graphqlHttpProvider: string
  public graphqlWSProvider: string
  public web3Provider: string
  public pendingOperations: Observable<Array<Operation<any>>> = of()
  public apolloClient: ApolloClient<object>

  constructor(options: {
    graphqlHttpProvider: string
    graphqlWSProvider: string
    web3Provider: string
  }) {
    this.graphqlHttpProvider = options.graphqlHttpProvider
    this.graphqlWSProvider = options.graphqlWSProvider
    this.web3Provider = options.web3Provider

    this.apolloClient = utils.createApolloClient({
      graphqlHttpProvider: this.graphqlHttpProvider,
      graphqlWSProvider: this.graphqlWSProvider
    })
  }

  /**
   * @return an observable array of DAO instances
   */
  public daos(options: IDaoQueryOptions = {}): Observable<DAO[]> {
    const query = gql`
      subscription {
        avatarContracts {
          id
          address
        }
      }
    `
    const zenObservable: ZenObservable<DAO[]> = this.apolloClient
      .subscribe<DAO[]>({ query })
      .map<DAO[]>((rs: object[]) => rs.map((r: any) => new DAO(r.address)))
    // cast as rxjsObservable
    return Observable.create((observer: Observer<DAO[]>) => zenObservable.subscribe(observer))
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
