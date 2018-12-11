import { ApolloClient, ApolloQueryResult } from 'apollo-client'
import { Observable as ZenObservable } from 'apollo-link'
import gql from 'graphql-tag'
import { from, Observable, Observer, of } from 'rxjs'
import { concat, map } from 'rxjs/operators'
import { DAO } from './dao'
import { Operation } from './operation'
import { Address } from './types'
import * as utils from './utils'

export class Arc {
  public graphqlHttpProvider: string
  public graphqlWsProvider: string
  public web3Provider: string
  public pendingOperations: Observable<Array<Operation<any>>> = of()
  public apolloClient: ApolloClient<object>

  constructor(options: {
    graphqlHttpProvider: string
    graphqlWsProvider: string
    web3Provider: string
  }) {
    this.graphqlHttpProvider = options.graphqlHttpProvider
    this.graphqlWsProvider = options.graphqlWsProvider
    this.web3Provider = options.web3Provider

    this.apolloClient = utils.createApolloClient({
      graphqlHttpProvider: this.graphqlHttpProvider,
      graphqlWsProvider: this.graphqlWsProvider
    })
  }

  public daos() {
    return this._getObjectListObservable(
      'avatarContract',
      ['id', 'address'],
      (r: any) => new DAO(r.address)
    )
  }

  /**
   * Returns an observable that:
   * - sends a query over http and returns the current list of results
   * - subscribes over a websocket to changes, and returns the updated list
   * example:
   *    _getObjectListObservable('avatarContract', ['id', 'address'], (r:any) => new DAO(r.address))
   *
   * @param  entity  name of the graphql entity to be queried.
   *  Use the singular, i.e avatarContract rather then avatarContracts
   * @param  fields  fhe fields of the entity
   * @param  itemMap a function that takes elements of the list and creates new objects
   * @return
   */
  public _getObjectListObservable(
    entity: string,
    fields: string[],
    itemMap: (o: object) => object
  ) {
    const query = gql`
      {
        ${entity}s {
          ${fields.concat('\n')}
        }
      }
    `
    const subscriptionQuery = gql`
      subscription ${query}
    `

    const zenObservable: ZenObservable<object[]> = this.apolloClient.subscribe<object[]>({ query })
    const subscriptionObservable = Observable.create((observer: Observer<object[]>) => {
      const subscription = zenObservable.subscribe(observer)
      return () => subscription.unsubscribe()
    })

    const queryPromise: Promise<
      ApolloQueryResult<{ avatarContracts: object[] }>
    > = this.apolloClient.query({ query })

    const queryObservable = from(queryPromise).pipe(
      // map to result set
      concat(subscriptionObservable),
      map(r => r.data.avatarContracts),
      map((rs: object[]) => rs.map(itemMap))
    )

    return queryObservable
  }
  /**
   * [dao description]
   * @param  address address of the dao Avatar
   * @return an instance of a DAO
   */
  public dao(address: Address): DAO {
    return new DAO(address)
  }
}
