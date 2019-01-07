import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import { Observable, Observer } from 'rxjs'
import { Arc } from '../src/arc'
import { createApolloClient } from '../src/utils'
import { graphqlHttpProvider, graphqlWsProvider, mintSomeReputation, waitUntilTrue } from './utils'

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

    const returnedData: object[] = []
    let cntr: number = 0

    await observable.subscribe(
      (eventData: any) => {
        // Do something on receipt of the event
        cntr += 1
        returnedData.push(eventData.data)
      },
      (err: any) => {
        throw err
      }
    )

    await mintSomeReputation()
    await mintSomeReputation()

    // we should have received two reputation events
    await waitUntilTrue(() => cntr === 2 )

    expect(returnedData.length).toBeGreaterThan(0)
    expect(cntr).toEqual(2)
  })

  it('getObservable works', async () => {
    const arc = new Arc({
      graphqlHttpProvider,
      graphqlWsProvider,
      web3Provider: 'http://127.0.0.1:8545'
    })
    const query = gql`{
        reputationMints {
          contract
          amount
          address
        }
      }
    `

    let cntr: number = 0
    const observable = arc.getObservable(query)

    let returnedData: object[] = []

    observable.subscribe(
      (eventData: any) => {
        // Do something on receipt of the event
        cntr += 1
        returnedData.push(eventData.data)
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
    await mintSomeReputation()

    // we should have received trhee reputation events
    // - 1 the result of original query
    // - 2 the two mint events
    await waitUntilTrue(() => cntr === 3 )
    expect(returnedData.length).toBeGreaterThan(0)
    expect(cntr).toEqual(3)
  })

})
