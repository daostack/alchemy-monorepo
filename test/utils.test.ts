import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import { from, Observable, Observer, of } from 'rxjs'
import { createApolloClient } from '../src/utils'
import { createSubscriptionObservable } from './from-subgraph/util'
import { graphqlHttpProvider, graphqlWsProvider, mintSomeReputation, web3Provider } from './utils'

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
  jest.setTimeout(10000)
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
    const expected = {
      data: { avatarContracts: [] },
      loading: false,
      networkStatus: 7,
      stale: false
    }
    expect(result).toEqual(expected)
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

    const consumer = await observable.subscribe(
      (eventData: any) => {
        // Do something on receipt of the event
        console.log(eventData)
        returnedData = eventData.data.reputationMints
      },
      (err: any) => {
        throw err
      }
    )

    const promise = observable.toPromise()
    promise.then((x: any) => {
      console.log('FROM PROMISE')
      console.log(x)
      returnedData = x.data.reputationMints
    })

    mintSomeReputation()

    // console.log(await promise)
    // wait

    await new Promise(res => setTimeout(res, 2000))

    expect(returnedData.length).toBeGreaterThan(0)

    // consumer.unsubscribe()
    // console.log(ob)
  })
})
