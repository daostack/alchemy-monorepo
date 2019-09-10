import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import { Observable, Observer } from 'rxjs'
import { Arc } from '../src/arc'
import { createApolloClient } from '../src/graphnode'
import { getContractAddressesFromMigration } from '../src/utils'
import { graphqlHttpProvider, graphqlWsProvider, mintSomeReputation, waitUntilTrue } from './utils'

function getClient() {
  const apolloClient = createApolloClient({
    graphqlHttpProvider,
    graphqlWsProvider
  })
  return apolloClient
}

jest.setTimeout(20000)
/**
 * Token test
 */
describe('apolloClient', () => {
  let client: any

  it('can be instantiated', () => {
    client = getClient()
    expect(client).toBeInstanceOf(ApolloClient)
  })

  it('handles querying', async () => {
    client = getClient()
    const query = gql`
      {
          reputationMints {
            contract
            amount
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
    const zenObservable = await client.subscribe({ query, fetchPolicy: 'no-cache' })
    // cast it to an rxjs observable
    const observable = Observable.create((observer: Observer<any>) =>
      zenObservable.subscribe(observer)
    )

    const returnedData: object[] = []
    let cntr: number = 0

    const subscription = observable.subscribe(
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
    subscription.unsubscribe()
  })

  it('getObservable works', async () => {
    const arc = new Arc({
      contractInfos: getContractAddressesFromMigration('private'),
      graphqlHttpProvider,
      graphqlWsProvider,
      ipfsProvider: '',
      web3Provider: 'ws://127.0.0.1:8545'
    })
    const query = gql`{
        reputationMints {
          contract
          amount
          address
        }
      }
    `

    const observable = arc.getObservable(query)

    const returnedData: object[] = []

    const subscription = observable.subscribe(
      (eventData: any) => {
        // Do something on receipt of the event
        returnedData.push(eventData.data)
      },
      (err: any) => {
        throw err
      }
    )

    await mintSomeReputation()
    await mintSomeReputation()

    await waitUntilTrue(() => returnedData.length >= 2 )
    // expect(cntr).toEqual(3)
    subscription.unsubscribe()
  })

  it('subscribe manually', async () => {
    const arc = new Arc({
      contractInfos: getContractAddressesFromMigration('private'),
      graphqlHttpProvider,
      graphqlWsProvider,
      ipfsProvider: '',
      web3Provider: 'ws://127.0.0.1:8545'
    })
    const query = gql`{
        reputationMints {
          contract
          amount
          address
        }
      }
    `

    const observable = arc.getObservable(query, {fetchPolicy: 'cache-only'})

    const returnedData: object[] = []

    const subscription = observable.subscribe(
      (eventData: any) => {
        // Do something on receipt of the event
        returnedData.push(eventData.data)
      },
      (err: any) => {
        throw err
      }
    )

    await mintSomeReputation()
    await mintSomeReputation()

    await waitUntilTrue(() => returnedData.length >= 2 )
    // expect(cntr).toEqual(3)
    subscription.unsubscribe()
  })
})
