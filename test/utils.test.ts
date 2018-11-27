import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import { from, Observable, Observer, of } from 'rxjs'
import { createApolloClient } from '../src/utils'
import { graphqlHttpProvider, graphqlWSProvider, web3Provider } from './utils'

function getClient() {
  const apolloClient = createApolloClient({
    graphqlHttpProvider,
    graphqlWSProvider
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

  it.skip('handles subscriptions', async () => {
    client = getClient()
    const query = gql`
      {
        subscription {
          reputationMints {
            contract
            amount
            address
          }
        }
      }
    `
    const result = await client.subscribe({ query })
    // console.log(client.graphqlWSProvider)
    console.log(result)
    const ob = Observable.create((observer: Observer<any>) => result.subscribe(observer))
    console.log(ob)
    console.log(await ob.toPromise())
  })
})
