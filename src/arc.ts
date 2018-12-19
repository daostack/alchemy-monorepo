import { ApolloClient, ApolloQueryResult } from 'apollo-client'
import { Observable as ZenObservable } from 'apollo-link'
import gql from 'graphql-tag'
import { from, Observable, Observer, of } from 'rxjs'
import { concat, map } from 'rxjs/operators'
import { DAO } from './dao'
import { Operation } from './operation'
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
   * [dao description]
   * @param  address address of the dao Avatar
   * @return an instance of a DAO
   */
  public dao(address: Address): DAO {
    return new DAO(address, this)
  }

  public daos(): Observable<DAO[]> {
    const query = gql`
      {
        avatarContracts {
          id
          address
        }
      }
    `
    return this._getObjectListObservable(
      query,
      'avatarContracts',
      (r: any) => new DAO(r.address, this)
    ) as Observable<DAO[]>
  }

    /**
     * Returns an observable that:
     * - sends a query over http and returns the current list of results
     * - subscribes over a websocket to changes, and returns the updated list
     * example:
     *    const query = gql`
     *    {
     *      dao {
     *        id
     *        address
     *      }
     *    }`
     *    _getObjectListObservable(query, 'dao', (r:any) => new DAO(r.address))
     *
     * @param query The query to be run
     * @param  entity  name of the graphql entity to be queried.
     *  Use the singular, i.e avatarContract rather then avatarContracts
     * @param  itemMap (optional) a function that takes elements of the list and creates new objects
     * @return
     */
  public _getObjectListObservable(
    query: any,
    entity: string,
    itemMap: (o: object) => object = (o) => o
  ) {
    return this._getObservable(query).pipe(
      map((r) => r.data[entity]),
      map((rs: object[]) => rs.map(itemMap))
    )
  }
   public _getObjectObservable(
    query: any,
    entity: string,
    itemMap: (o: object) => object = (o) => o
  ) {
    return this._getObservable(query).pipe(
      map((r) => r.data[entity]),
      map(itemMap)
    )
  }
   public _getObservable(query: any) {
    const subscriptionQuery = gql`
      subscription ${query}
    `

    const zenObservable: ZenObservable<object[]> = this.apolloClient.subscribe<object[]>({ query: subscriptionQuery })

    const subscriptionObservable = Observable.create((observer: Observer<object[]>) => {
      const subscription = zenObservable.subscribe(observer)
      return () => subscription.unsubscribe()
    })
    const queryPromise: Promise<
      ApolloQueryResult<{ [key: string]: object[] }>
    > = this.apolloClient.query({ query })
    const queryObservable = from(queryPromise).pipe(
      concat(subscriptionObservable)
    )
    return queryObservable as Observable<any>
  }
}
