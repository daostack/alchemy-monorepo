import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient, ApolloQueryResult } from 'apollo-client'
import { Observable as ZenObservable, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import fetch from 'isomorphic-fetch'
import * as WebSocket from 'isomorphic-ws'
import gql from 'graphql-tag'
import { from, Observable, Observer } from 'rxjs'
import { concat, map } from 'rxjs/operators'

export function createApolloClient(options: {
  graphqlHttpProvider: string
  graphqlWsProvider: string
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
      const definition = getMainDefinition(query)
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    httpLink
  )
  // we can also add error handling
  // const errorHandlingLink = apollolink.from([
  //     onerror(({ graphqlerrors, networkerror }) => {
  //       if (graphqlerrors) {
  //         graphqlerrors.map(({ message, locations, path }) =>
  //           console.log(
  //             `[graphql error]: message: ${message}, location: ${locations}, path: ${path}`,
  //           ),
  //         );
  //       if (networkerror) { console.log(`[network error]: ${networkerror}`)}
  //       }
  //     }),
  //     wsorhttplink
  //   ])
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: wsOrHttpLink
  })
  return client
}

export function checkWebsocket(options: { url: string }) {
  const ws = new WebSocket(options.url, {
    // origin: 'https://websocket.org'
  })

  ws.onopen = function open() {
    console.log('connected')
    ws.send(Date.now())
  }

  ws.onclose = function close() {
    console.log('disconnected')
  }

  ws.onmessage = function incoming(data: any) {
    console.log(`Roundtrip time: ${Date.now() - data} ms`)

    setTimeout(function timeout() {
      ws.send(Date.now())
    }, 500)
  }
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
  export function _getObjectListObservable(
    apolloClient: ApolloClient<any>,
    query: any,
    entity: string,
    itemMap: (o: object) => object = (o) => o
  ) {
    return _getObservable(apolloClient, query).pipe(
      map((r) => r.data[entity]),
      map((rs: object[]) => rs.map(itemMap))
    )
  }

  export function _getObjectObservable(
    apolloClient: ApolloClient<any>,
    query: any,
    entity: string,
    itemMap: (o: object) => object = (o) => o
  ) {
    return _getObservable(apolloClient, query).pipe(
      map((r) => r.data[entity]),
      map(itemMap)
    )
  }

  export function _getObservable(apolloClient: ApolloClient<any>, query: any) {
    const subscriptionQuery = gql`
      subscription ${query}
    `

    const zenObservable: ZenObservable<object[]> = apolloClient.subscribe<object[]>({ query })
    const subscriptionObservable = Observable.create((observer: Observer<object[]>) => {
      const subscription = zenObservable.subscribe(observer)
      return () => subscription.unsubscribe()
    })

    const queryPromise: Promise<
      ApolloQueryResult<{ [key: string]: object[] }>
    > = apolloClient.query({ query })

    const queryObservable = from(queryPromise).pipe(
      concat(subscriptionObservable)
    )

    return queryObservable as Observable<any>
  }
  