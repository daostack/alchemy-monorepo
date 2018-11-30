import Avatar from '@daostack/arc/build/contracts/Avatar.json'
import { ApolloClient, ApolloQueryResult } from 'apollo-client'
import { Observable as ZenObservable } from 'apollo-link'
import gql from 'graphql-tag'
import { from, Observable, Observer, of } from 'rxjs'
import { concat, map } from 'rxjs/operators'
import { DAO, IDaoQueryOptions } from './dao'
import { Operation } from './operation'
import { Proposal } from './proposal'
import { Address } from './types'
import * as utils from './utils'

export class Arc {
  public graphqlHttpProvider: string
  public graphqlWsProvider: string
  public web3Provider: string
  public pendingOperations: Observable<Array<Operation<any>>> = of()
  public apolloClient: ApolloClient<object>

  constructor(options: {
    graphqlHttpProvider: string
    graphqlWsProvider: string
    web3Provider: string
  }) {
    this.graphqlHttpProvider = options.graphqlHttpProvider
    this.graphqlWsProvider = options.graphqlWsProvider
    this.web3Provider = options.web3Provider

    this.apolloClient = utils.createApolloClient({
      graphqlHttpProvider: this.graphqlHttpProvider,
      graphqlWsProvider: this.graphqlWsProvider
    })
  }

  /**
   * @return an observable array of DAO instances
   */
  public daos(options: IDaoQueryOptions = {}): Observable<DAO[]> {
    const query = gql`
      {
        avatarContracts {
          id
          address
        }
      }
    `
    const subscriptionQuery = gql`
      subscription ${query}
    `

    const zenObservable: ZenObservable<DAO[]> = this.apolloClient.subscribe<DAO[]>({ query })
    const subscriptionObservable = Observable.create((observer: Observer<DAO[]>) => {
      const subscription = zenObservable.subscribe(observer)
      return () => subscription.unsubscribe()
    })

    const queryPromise: Promise<
      ApolloQueryResult<{ avatarContracts: object[] }>
    > = this.apolloClient.query({ query })

    const queryObservable = from(queryPromise).pipe(
      // map to result set
      concat(subscriptionObservable),
      map(r => r.data.avatarContracts),
      map((rs: object[]) => rs.map((r: any) => new DAO(r.address)))
    )

    return queryObservable
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
