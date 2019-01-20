import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient, ApolloQueryResult } from 'apollo-client'
import { Observable as ZenObservable, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import fetch from 'isomorphic-fetch'
import * as WebSocket from 'isomorphic-ws'

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

export const nullAddress = '0x0000000000000000000000000000000000000000'

export async function getOptionsFromChain(web3: any) {
  if (web3.eth.defaultAccount === null) {
    throw Error('No default account specified: please set web3.eth.defaultAccount')
  }
  const block = await web3.eth.getBlock('latest')
  return {
    from: web3.eth.defaultAccount,
    gas: block.gasLimit - 100000
  }
}

export function getWeb3Options(web3: any) {
  return {
    from: web3.eth.defaultAccount,
    gas: 7900000
  }
}
