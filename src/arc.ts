import { ApolloClient, ApolloQueryResult } from 'apollo-client'
import { Observable as ZenObservable } from 'apollo-link'
import gql from 'graphql-tag'
import { from, Observable, Observer, of } from 'rxjs'
import { concat, map } from 'rxjs/operators'
import { DAO } from './dao'
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
        daos {
          id
        }
      }
    `
    return this._getObservableList(
      query,
      'daos',
      (r: any) => new DAO(r.id, this)
    ) as Observable<DAO[]>
  }

  public proposal(id: string): Proposal {
    return new Proposal(id, this)
  }

  /**
   * getBalance returns an observer with a stream of ETH balances
   * @param  address [description]
   * @return         [description]
   */
  public getBalance(address: Address) {
    // web3 = new Web3(this.web3 )
  }
  /**
   * Returns an observable that:
   * - sends a query over http and returns the current list of results
   * - subscribes over a websocket to changes, and returns the updated list
   * example:
   *    const query = gql`
   *    {
   *      daos {
   *        id
   *        address
   *      }
   *    }`
   *    _getObservableList(query, 'daos', (r:any) => new DAO(r.address))
   *
   * @param query The query to be run
   * @param  entity  name of the graphql entity to be queried.
   * @param  itemMap (optional) a function that takes elements of the list and creates new objects
   * @return
   */
  public _getObservableList(
    query: any,
    entity: string,
    itemMap: (o: object) => object = (o) => o
  ) {
    return this.getObservable(query).pipe(
      map((r) => {
        if (!r.data[entity]) { throw Error(`Could not find ${entity} in ${r.data}`)}
        return r.data[entity]
      }),
      map((rs: object[]) => rs.map(itemMap))
    )
  }

  public _getObservableObject(
    query: any,
    entity: string,
    itemMap: (o: object) => object = (o) => o
  ) {
    return this.getObservable(query).pipe(
      map((r) => {
        if (!r.data) {
          return null
        }
        return r.data[entity]
      }),
      map(itemMap)
    )
  }

  public getObservable(query: any) {
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
