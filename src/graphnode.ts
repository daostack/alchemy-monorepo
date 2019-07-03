import { ApolloClient, ApolloQueryResult } from 'apollo-client'
import { Observable as ZenObservable } from 'apollo-link'
import gql from 'graphql-tag'
import { Observable, Observer } from 'rxjs'
import { catchError, filter, first, map } from 'rxjs/operators'
import { Logger } from './logger'
import { createApolloClient, zenToRxjsObservable } from './utils'

/**
 * handles connections with the Graph
 * @param options [description]
 */
export class GraphNodeObserver {
  public graphqlHttpProvider?: string
  public graphqlWsProvider?: string
  public Logger = Logger
  private apolloClient?: ApolloClient<object>

  constructor(options: {
    graphqlHttpProvider?: string
    graphqlWsProvider?: string
  }) {
    if (options.graphqlHttpProvider && options.graphqlWsProvider) {
      this.graphqlHttpProvider = options.graphqlHttpProvider
      this.graphqlWsProvider = options.graphqlWsProvider
      this.apolloClient = createApolloClient({
        graphqlHttpProvider: this.graphqlHttpProvider,
        graphqlWsProvider: this.graphqlWsProvider
      })
    }
  }

  /**
   * Given a gql query, will return an observable of query results
   * @param  query              a gql query object to execute
   * @param  apolloQueryOptions options to pass on to Apollo, cf ..
   * @return an Observable that will first yield the current result, and yields updates every time the data changes
   */
  public getObservable(
    query: any,
    apolloQueryOptions: IApolloQueryOptions = {}
  ) {

    if (!this.apolloClient) {
      throw Error(`No connection to the graph - did you set graphqlHttpProvider and graphqlWsProvider?`)
    }
    const apolloClient = this.apolloClient as ApolloClient<object>
    const observable = Observable.create(async (observer: Observer<ApolloQueryResult<any>>) => {
      Logger.debug(query.loc.source.body)

      if (!apolloQueryOptions.fetchPolicy) {
        apolloQueryOptions.fetchPolicy = 'cache-first'
      }

      // subscriptionQuery subscribes to get notified of updates to the query
      const subscriptionQuery = gql`
          subscription ${query}
        `
      // subscribe
      const zenObservable: ZenObservable<object[]> = apolloClient.subscribe<object[]>({
        fetchPolicy: 'cache-first',
        query: subscriptionQuery
       })

      zenObservable.subscribe((next: any) => {
          apolloClient.writeQuery({
            data: next.data,
            query
          })
      })

      const sub = zenToRxjsObservable(
        apolloClient.watchQuery({
          fetchPolicy: apolloQueryOptions.fetchPolicy,
          fetchResults: true,
          query
        })
      )
        .pipe(
          filter((r: ApolloQueryResult<any>) => {
            return !r.loading
          }), // filter empty results
          catchError((err: Error) => {
            throw Error(`${err.name}: ${err.message}\n${query.loc.source.body}`)
          })
        )
        .subscribe(observer)
      return () => sub.unsubscribe()
    })
    observable.first = () => observable.pipe(first()).toPromise()
    return observable
  }

  /**
   * Returns an observable that:
   * - sends a query over http and returns the current list of results
   * - subscribes over a websocket to changes, and returns the updated list.
   *
   * @param query The query to be run
   * @param  entity  name of the graphql entity to be queried.
   * @param  itemMap (optional) a function that takes elements of the list and creates new objects
   * @return an Observable
   * @example:
   * ```
   *    const query = gql`
   *    {
   *      daos {
   *        id
   *        address
   *      }
   *    }`
   *    getObservableList(query, (r:any) => new DAO(r.address))
   * ```
   */
  public getObservableList(
    query: any,
    itemMap: (o: object) => object | null = (o) => o,
    apolloQueryOptions: IApolloQueryOptions = {}
  ) {
    const entity = query.definitions[0].selectionSet.selections[0].name.value
    return this.getObservable(query, apolloQueryOptions).pipe(
      map((r: ApolloQueryResult<any>) => {
        if (!r.data[entity]) {
          throw Error(`Could not find entity '${entity}' in ${Object.keys(r.data)}`)
        }
        return r.data[entity]
      }),
      map((rs: object[]) => rs.map(itemMap).filter((x) => x !== null))
    )
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
   *    getObservableList(query, (r:any) => new DAO(r.address), filter((r:any) => r.address === "0x1234..."))
   *
   * @param query The query to be run
   * @param  entity  name of the graphql entity to be queried.
   * @param  itemMap (optional) a function that takes elements of the list and creates new objects
   * @param filter filter the results
   * @return
   */
  public getObservableListWithFilter(
    query: any,
    itemMap: (o: object) => object | null = (o) => o,
    filterFunc: (o: object) => boolean,
    apolloQueryOptions: IApolloQueryOptions = {}
  ) {
    const entity = query.definitions[0].selectionSet.selections[0].name.value
    return this.getObservable(query, apolloQueryOptions).pipe(
      map((r: ApolloQueryResult<object[]>) => {
        if (!r.data[entity]) { throw Error(`Could not find ${entity} in ${r.data}`)}
        return r.data[entity]
      }),
      filter(filterFunc),
      map((rs: object[]) => rs.map(itemMap))
    )
  }

  public getObservableObject(
    query: any,
    itemMap: (o: object) => object | null = (o) => o,
    apolloQueryOptions: IApolloQueryOptions = {}
  ) {
    const entity = query.definitions[0].selectionSet.selections[0].name.value

    return this.getObservable(query, apolloQueryOptions).pipe(
      map((r: ApolloQueryResult<any>) => {
        if (!r.data) {
          return null
        }
        return r.data[entity]
      }),
      map(itemMap)
    )
  }

  public sendQuery(query: any) {
    if (!this.apolloClient) {
      throw Error(`No connection to the graph - did you set graphqlHttpProvider and graphqlWsProvider?`)
    }
    const apolloClient = this.apolloClient as ApolloClient<object>
    return apolloClient.query({ query })
  }

}

export interface IApolloQueryOptions {
  fetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only' | 'cache-only' | 'no-cache' | 'standby'
}
