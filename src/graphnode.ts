import { defaultDataIdFromObject, InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient, ApolloQueryResult } from 'apollo-client'
import { ApolloLink, FetchResult, Observable as ZenObservable, split } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { HttpLink } from 'apollo-link-http'
import { RetryLink } from 'apollo-link-retry'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import gql from 'graphql-tag'
import fetch from 'isomorphic-fetch'
import * as WebSocket from 'isomorphic-ws'
import { Observable, Observer } from 'rxjs'
import { catchError, filter, first, map } from 'rxjs/operators'
import { Logger } from './logger'
import { zenToRxjsObservable } from './utils'

export interface IApolloQueryOptions {
  fetchPolicy?: 'cache-first' | 'network-only' | 'cache-only' | 'no-cache' | 'standby',
  subscribe?: true | false,
  fetchAllData?: true | false
}

export interface IObservable<T> extends Observable<T> {
  first: () => T
}

export function createApolloClient(options: {
  graphqlHttpProvider: string,
  graphqlWsProvider: string,
  prefetchHook?: (query: any) => any, // a callback function that will be called for each query sent to the link
  errHandler?: (event: any) => any,
  retryLink?: any // apollo retry link instance
}) {
  const httpLink = new HttpLink({
    credentials: 'same-origin',
    fetch,
    uri: options.graphqlHttpProvider
  })

  const wsLink = new WebSocketLink({
    options: {
      reconnect: true
    },
    uri: options.graphqlWsProvider,
    webSocketImpl: WebSocket
  })

  const wsOrHttpLink = split(
    // split based on operation type
    ({ query }) => {
      if (options.prefetchHook) {
        options.prefetchHook(query)
      }
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    httpLink
  )
  // we can also add error handling
  if (!options.retryLink) {
    options.retryLink = new RetryLink({
      attempts: {
        max: 5,
        // @ts-ignore
        retryIf: (error, operation) =>  !!error
      },
      delay: {
        initial: 300,
        jitter: true,
        max: Infinity
      }
    })
  }

  if (!options.errHandler) {
    options.errHandler = (event) => {
      if (event.graphQLErrors) {
        event.graphQLErrors.map((err: any) =>
          Logger.error(
            `[graphql error]: message: ${err.message}, location: ${err.locations}, path: ${err.path}`
          )
        )
      }
      if (event.networkError) {
        Logger.error(`[network error]: ${event.networkError}`)
      }
    }
  }
  const errorHandlingLink = onError(options.errHandler)

  const link = ApolloLink.from([
    errorHandlingLink,
    options.retryLink,
    wsOrHttpLink
  ])

  const cache = new InMemoryCache({
    cacheRedirects: {
      Query: {
        // competition: (_, args, { getCacheKey }) => {
        //   return getCacheKey({ __typename: 'CompetitionProposal', id: args.id })
        // },
        competitionProposal: (_, args, { getCacheKey }) => {
          return getCacheKey({ __typename: 'CompetitionProposal', id: args.id })
        },
        competitionSuggestion: (_, args, { getCacheKey }) => {
          return getCacheKey({ __typename: 'CompetitionSuggestion', id: args.id })
        },
        competitionVote: (_, args, { getCacheKey }) => {
          return getCacheKey({ __typename: 'CompetitionVote', id: args.id })
        },
        controllerScheme: (_, args, { getCacheKey }) => {
          return getCacheKey({ __typename: 'ControllerScheme', id: args.id })
        },
        dao: (_, args, { getCacheKey }) =>  {
          return getCacheKey({ __typename: 'DAO', id: args.id })
        },
        proposal: (_, args, { getCacheKey }) => {
          return getCacheKey({ __typename: 'Proposal', id: args.id })
        },
        proposalStake: (_, args, { getCacheKey }) => {
          return getCacheKey({ __typename: 'ProposalStake', id: args.id })
        },
        proposalVote: (_, args, { getCacheKey }) => {
          return getCacheKey({ __typename: 'ProposalVote', id: args.id })
        },
        reputationHolder: (_, args, { getCacheKey }) => {
          return getCacheKey({ __typename: 'ReputationHolder', id: args.id })
        }
      }
    },
    dataIdFromObject: (object) => {
      switch (object.__typename) {
        case 'ProposalVote': return undefined
        case 'ProposalStake': return undefined
        case 'CompetitionSuggestion': return undefined
        case 'CompetitionVote': return undefined
        default: return defaultDataIdFromObject(object) // fall back to default handling
      }
    }
  })
  const client = new ApolloClient({
    cache,
    connectToDevTools: true, // TODO: this probably not in production!
    link
  })
  return client
}

/**
 * handles connections with the Graph
 * @param options [description]
 */
export class GraphNodeObserver {
  public graphqlHttpProvider?: string
  public graphqlWsProvider?: string
  public Logger = Logger
  public apolloClient?: ApolloClient<object>
  public graphqlSubscribeToQueries?: boolean

  constructor(options: {
    graphqlHttpProvider?: string
    graphqlWsProvider?: string
    graphqlSubscribeToQueries?: boolean
    prefetchHook?: any
    errHandler?: any
    retryLink?: any
  }) {
    this.graphqlSubscribeToQueries = (
      options.graphqlSubscribeToQueries === undefined || options.graphqlSubscribeToQueries
    )
    if (options.graphqlHttpProvider && options.graphqlWsProvider) {
      this.graphqlHttpProvider = options.graphqlHttpProvider as string
      this.graphqlWsProvider = options.graphqlWsProvider as string
      this.apolloClient = createApolloClient({
        ...options,
        graphqlHttpProvider: this.graphqlHttpProvider as string,
        graphqlWsProvider: this.graphqlWsProvider as string
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
    const graphqlSubscribeToQueries = this.graphqlSubscribeToQueries
    const observable = Observable.create((observer: Observer<ApolloQueryResult<any>>) => {
      Logger.debug(query.loc.source.body)
      if (!apolloQueryOptions.fetchPolicy) {
        apolloQueryOptions.fetchPolicy = 'cache-first'
      }

      let subscriptionSubscription: any
      let subscribe: boolean = true
      if (apolloQueryOptions.subscribe !== undefined) {
        subscribe = apolloQueryOptions.subscribe
      } else if (graphqlSubscribeToQueries !== undefined) {
        subscribe = graphqlSubscribeToQueries
      }
      if (subscribe) {
        // subscriptionQuery subscribes to get notified of updates to the query
        let subscriptionQuery
        if (query.loc.source.body.trim().startsWith('query')) {
          // remove the "query" part from the string
          subscriptionQuery = gql`
            subscription ${query.loc.source.body.trim().substring('query'.length)}
          `
        } else {
          subscriptionQuery = gql`
            subscription ${query}
          `

        }
        // send a subscription request to the server
        const subscriptionObservable: ZenObservable<FetchResult<object[], Record<string, any>, Record<string, any>>>
          = apolloClient.subscribe<object[]>({
          fetchPolicy: 'cache-first',
          // fetchPolicy: 'network-only',
          query: subscriptionQuery
         })
         // subscribe to the results
        subscriptionSubscription = subscriptionObservable.subscribe((next: any) => {
            apolloClient.writeQuery({
              data: next.data,
              query
            })
        })
      }

      const sub = zenToRxjsObservable(
        apolloClient.watchQuery({
          fetchPolicy: apolloQueryOptions.fetchPolicy,
          fetchResults: true,
          query
        }))
        .pipe(
          filter((r: ApolloQueryResult<any>) => {
            return !r.loading
          }), // filter empty results
          catchError((err: Error) => {
            throw Error(`11. ${err.name}: ${err.message}\n${query.loc.source.body}`)
          })
        )
        .subscribe(observer)
      return () => {
        if (subscriptionSubscription) {
          subscriptionSubscription.unsubscribe()
        }
        sub.unsubscribe()
      }
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
    const observable =  this.getObservable(query, apolloQueryOptions).pipe(
      map((r: ApolloQueryResult<any>) => {
        if (!r.data[entity]) {
          throw Error(`Could not find entity '${entity}' in ${Object.keys(r.data)}`)
        }
        return r.data[entity]
      }),
      map((rs: object[]) => rs.map(itemMap).filter((x) => x !== null))
    )
    observable.first = () => observable.pipe(first()).toPromise()
    return observable
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

    const observable = this.getObservable(query, apolloQueryOptions).pipe(
      map((r: ApolloQueryResult<any>) => {
        if (!r.data) {
          return null
        }
        return r.data[entity]
      }),
      map(itemMap)
    )
    observable.first = () => observable.pipe(first()).toPromise()
    return observable
  }

  public sendQuery(query: any, apolloQueryOptions: IApolloQueryOptions = {}) {
    if (!this.apolloClient) {
      throw Error(`No connection to the graph - did you set graphqlHttpProvider and graphqlWsProvider?`)
    }
    const apolloClient = this.apolloClient as ApolloClient<object>
    return apolloClient.query({...apolloQueryOptions, ...{query}})
  }

}
