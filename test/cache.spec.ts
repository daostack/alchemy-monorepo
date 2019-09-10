import { first } from 'rxjs/operators'
// import { ApolloClient } from 'apollo-client'
// import gql from 'graphql-tag'
// import { Observable, Observer } from 'rxjs'
import { Arc } from '../src/arc'
// import { createApolloClient } from '../src/graphnode'
import { getContractAddressesFromMigration } from '../src/utils'
import { graphqlHttpProvider, graphqlWsProvider
  // , mintSomeReputation, waitUntilTrue
} from './utils'

// function getClient() {
//   const apolloClient = createApolloClient({
//     graphqlHttpProvider,
//     graphqlWsProvider
//   })
//   return apolloClient
// }

jest.setTimeout(20000)
/**
 * Token test
 */
describe('apolloClient', () => {
  // let client: any

  it('pre-fetching DAOs works', async () => {
    const arc = new Arc({
      contractInfos: getContractAddressesFromMigration('private'),
      graphqlHttpProvider,
      graphqlWsProvider,
      ipfsProvider: '',
      web3Provider: 'ws://127.0.0.1:8545'
    })

    const client = arc.apolloClient
    // get all DAOs
    const daos = await arc.daos().pipe(first()).toPromise()
    // @ts-ignore
    console.log(client.cache.data.data)
    // we should now be able to get data of individual DAOs without hitting the server
    const p = arc.dao(daos[0].id).state({ fetchPolicy: 'cache-only'}).pipe(first()).toPromise()
    expect(p).rejects.toThrow()

    // now get all the DAOs with defailed data
    await arc.daos({}, { fetchAllData: true }).pipe(first()).toPromise()
    const dao = await arc.dao(daos[0].id).state({ fetchPolicy: 'cache-only'}).pipe(first()).toPromise()
    // @ts-ignore
    // console.log(client.cache.data.data)
    console.log(dao.address)

    //
    const result = await arc.daos({ where: { name: dao.name}}, { fetchPolicy: 'cache-only'}).pipe(first()).toPromise()
    console.log(result)

    // const observable = arc.getObservable(query)
    //
    // const returnedData: object[] = []
    //
    // const subscription = observable.subscribe(
    //   (eventData: any) => {
    //     // Do something on receipt of the event
    //     returnedData.push(eventData.data)
    //   },
    //   (err: any) => {
    //     throw err
    //   }
    // )
    //
    // await mintSomeReputation()
    // await mintSomeReputation()
    //
    // await waitUntilTrue(() => returnedData.length >= 2 )
    // expect(cntr).toEqual(3)
    // subscription.unsubscribe()
  })

})
