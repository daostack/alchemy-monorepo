// import { from, Observable, Observer, of } from 'rxjs'
// import { checkWebsocket, concat, createApolloClient } from '../src/utils'
// import { graphqlHttpProvider, graphqlWsProvider } from './utils'
// const { execute } = require('apollo-link')
// const { WebSocketLink } = require('apollo-link-ws')
// const { SubscriptionClient } = require('subscriptions-transport-ws')
// const web3 = require('web3')
//
// // export const createSubscriptionObservable = (
// //   query: string,
// //   variables = 0,
// //   wsurl = graphqlWsProvider
// // ) => {
// //   const client = new SubscriptionClient(wsurl, { reconnect: true }, ws)
// //   const link = new WebSocketLink(client)
// //   return execute(link, { query, variables })
// // }
// //
// // function getClient() {
// //   const apolloClient = createApolloClient({
// //     graphqlHttpProvider,
// //     graphqlWsProvider
// //   })
// //   return apolloClient
// // }
//
// describe('utils', () => {
//   // it.skip('checkWebsocket works', (done) => {
//   //   // checkWebsocket({ url: graphqlWsProvider})
//   //
//   //   const wsProvider = new WebSocket(graphqlWsProvider, {
//   //     // origin: 'https://websocket.org'
//   //   })
//   //
//   //   wsProvider.onopen = function open() {
//   //     console.log('connected')
//   //     wsProvider.send(Date.now())
//   //   }
//   //
//   //   wsProvider.onclose = function close() {
//   //     console.log('disconnected')
//   //   }
//   //
//   //   wsProvider.onmessage = function incoming(data: any) {
//   //     console.log(`Roundtrip time: ${Date.now() - data} ms`)
//   //     done()
//   //   }
//   //
//   //   wsProvider.on('rawData', (msg: string) => {
//   //     console.log('RAW: ' + msg)
//   //   })
//   // })
//
//   it('concat works', () => {
//     const proposalId = web3.utils.hexToBytes('0xc31f2952787d52a41a2b2afd8844c6e295f1bed932a3a433542d4c420965028e')
//     const voter = web3.utils.hexToBytes('0x22d491bde2303f2f43325b2108d26f1eaba1e32b')
//     const expected = '0x722a6689b806691e9419d5414360cbfba84657401f3e0351889b24d31c4a9bb8'
//     expect(concat(proposalId, voter)).toEqual(expected)
//   })
// })
