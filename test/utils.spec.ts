import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import { from, Observable, Observer, of } from 'rxjs'
import { checkWebsocket, createApolloClient } from '../src/utils'
import { graphqlHttpProvider, graphqlWsProvider, mintSomeReputation, web3Provider } from './utils'
const { execute } = require('apollo-link')
const { WebSocketLink } = require('apollo-link-ws')
const { SubscriptionClient } = require('subscriptions-transport-ws')
const WebSocket = require('isomorphic-ws')
const ws = require('ws')
import axios from 'axios'

export const createSubscriptionObservable = (
  query: string,
  variables = 0,
  wsurl = graphqlWsProvider
) => {
  const client = new SubscriptionClient(wsurl, { reconnect: true }, ws)
  const link = new WebSocketLink(client)
  return execute(link, { query, variables })
}

function getClient() {
  const apolloClient = createApolloClient({
    graphqlHttpProvider,
    graphqlWsProvider
  })
  return apolloClient
}

/**
 * Token test
 */
describe('apolloClient', () => {
  let client
  jest.setTimeout(5000)

  it('can be instantiated', () => {
    client = getClient()
    expect(client).toBeInstanceOf(ApolloClient)
  })

  it('handles querying', async () => {
    client = getClient()
    const query = gql`
      {
        avatarContracts {
          id
          address
        }
      }
    `

    const result = await client.query({ query })
    expect(result.networkStatus).toEqual(7)
    expect(typeof result.data).toEqual(typeof [])
  })

  it('handles subscriptions', async () => {
    client = getClient()
    const query = gql`
      subscription {
        reputationMints {
          contract
          amount
          address
        }
      }
    `
    // client.subcribe returns a zenObservable
    const zenObservable = await client.subscribe({ query })
    // cast it to an rxjs observable
    const observable = Observable.create((observer: Observer<any>) =>
      zenObservable.subscribe(observer)
    )

    let returnedData: object[] = []
    let cntr = 0

    const consumer = await observable.subscribe(
      (eventData: any) => {
        // Do something on receipt of the event
        cntr += 1
        // console.log(`${cntr}: ${eventData}`)
        returnedData = eventData.data.reputationMints
      },
      (err: any) => {
        throw err
      }
    )

    const promise = observable.toPromise()
    promise.then((x: any) => {
      returnedData = x.data.reputationMints
    })

    await mintSomeReputation()
    mintSomeReputation()

    await new Promise((res) => setTimeout(res, 2000))

    expect(returnedData.length).toBeGreaterThan(0)
  })
})

describe('utils', () => {
  it.skip('checkWebsocket works', (done) => {
    // checkWebsocket({ url: graphqlWsProvider})

    const wsProvider = new WebSocket(graphqlWsProvider, {
      // origin: 'https://websocket.org'
    })

    wsProvider.onopen = function open() {
      console.log('connected')
      wsProvider.send(Date.now())
    }

    wsProvider.onclose = function close() {
      console.log('disconnected')
    }

    wsProvider.onmessage = function incoming(data: any) {
      console.log(`Roundtrip time: ${Date.now() - data} ms`)
      done()
    }

    wsProvider.on('rawData', (msg: string) => {
      console.log('RAW: ' + msg)
    })
  })
})
