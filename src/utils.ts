import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient, ApolloQueryResult } from 'apollo-client'
import { split } from 'apollo-link'
import { Observable as ZenObservable } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import BN = require('bn.js')
import gql from 'graphql-tag'
import fetch from 'isomorphic-fetch'
import * as WebSocket from 'isomorphic-ws'
import { Observable, Observer } from 'rxjs'
import { IContractAddresses } from './arc'
import { Logger } from './logger'
import { Address } from './types'
const Web3 = require('web3')

export function fromWei(amount: BN): string {
  return Web3.utils.fromWei(amount, 'ether')
}

export function toWei(amount: string | number): BN {
  return Web3.utils.toWei(amount.toString(), 'ether')
}

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
    Logger.warn(`No defaultAccount was set -- cannot send transaction`)
  }
  const block = await web3Instance.eth.getBlock('latest')
  return {
    from: web3Instance.eth.defaultAccount,
    gas: block.gasLimit - 100000
  }
}

export function getWeb3Options(web3Instance: any) {
  if (!web3Instance.eth.defaultAccount) {
    Logger.warn(`No defaultAccount was set -- cannot send transaction`)
  }
  return {
    from: web3Instance.eth.defaultAccount,
    gas: 6000000
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
  const hash = Web3.utils.keccak256(concat(event.transactionHash, event.logIndex as Uint8Array))
  return hash
}

export function isAddress(address: Address) {
  if (!Web3.utils.isAddress(address)) {
    throw new Error(`Not a valid address: ${address}`)
  }
}

/**
 * convert a ZenObservable to an rxjs.Observable
 * @param  zenObservable [description]
 * @return an Observable instance
 */
export function zenToRxjsObservable(zenObservable: ZenObservable<any>) {
  return Observable.create((obs: Observer<any>) => {
    const subscription = zenObservable.subscribe(obs)
    return () => subscription.unsubscribe()
  })
}

/**
 * get the contract addresses by querying the "meta-url" of the subgraph deployment
 * (in the default configuration, if the subgraph is at a url of the form:
 *      http://some.thing/subgraphs/name/{subgraphName}/graphql
 * then the "metaurl" is:
 *      http://some.thing/subgraphs/graphql
 * @param  graphqlHttpProvider a URL of the form http://some.thing/subgraphs/graphql
 * @param  subgraphName        name of the subgraph
 * @return                     an array with contract names as keys and addresses as values
 */
export async function getContractAddresses(graphqlHttpProvider: string, subgraphName: string) {

  const query = gql`{
    subgraphs (where: { name: "${subgraphName}"} ) {
      id
      name
      currentVersion {
        deployment {
          manifest {
            dataSources {
              name
              source {
                abi
                address
              }
            }
          }
        }
      }
    }
  }`
  const httpLink = new HttpLink({
    credentials: 'same-origin',
    fetch,
    uri: graphqlHttpProvider
  })

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink
  })

  let response: any
  try {
    response = await client.query({query}) as ApolloQueryResult<{ subgraphs: any[]}>
  } catch (err) {
    console.log(err)
    throw err
  }
  const dataSources = response.data.subgraphs[0].currentVersion.deployment.manifest.dataSources
  const result: IContractAddresses = {}
  for (const record of dataSources) {
    const name: string = record.name
    const address = record.source.address
    result[name] = address.toLowerCase()
  }
  return result
}
