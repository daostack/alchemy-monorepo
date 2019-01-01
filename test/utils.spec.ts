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
