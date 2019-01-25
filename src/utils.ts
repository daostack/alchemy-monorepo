import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import fetch from 'isomorphic-fetch'
import * as WebSocket from 'isomorphic-ws'

const web3 = require('web3')

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

export async function getOptionsFromChain(web3Instance: any) {
  if (web3Instance.eth.defaultAccount === null) {
    throw Error('No default account specified: please set web3.eth.defaultAccount')
  }
  const block = await web3Instance.eth.getBlock('latest')
  return {
    from: web3Instance.eth.defaultAccount,
    gas: block.gasLimit - 100000
  }
}

export function getWeb3Options(web3Instance: any) {
  if (!web3Instance.eth.defaultAccount) {
    throw Error(`No defaultAccount was set -- cannot send transaction`)
  }
  return {
    from: web3Instance.eth.defaultAccount,
    gas: 7900000
  }
}

// function lifted and adapted from @daostack/subgraph/src/utils to generate unique ids
export function concat(a: Uint8Array, b: Uint8Array): Uint8Array {

  const out = new Uint8Array(a.length + b.length)
  for (let i = 0; i < a.length; i++) {
    out[i] = a[i]
  }
  for (let j = 0; j < b.length; j++) {
    out[a.length + j] = b[j]
  }
  // return out as ByteArray
  // return web3.utils.bytesToHex(out)
  return out
  // return web3.utils.keccak256(out)
}

type EthereumEvent = any

export function eventId(event: EthereumEvent): string {
  // console.log(event)
  // console.log(event.transactionHash)
  // console.log(event.logIndex)
  // console.log(concat(web3.utils.hexToBytes(event.transactionHash), event.logIndex as Uint8Array))
  // console.log(web3.utils.bytesToHex(concat(event.transactionHash, event.logIndex as Uint8Array)))
  const hash = web3.utils.keccak256(concat(event.transactionHash, event.logIndex as Uint8Array))
  // console.log(hash)
  return hash
}
