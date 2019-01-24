import { ApolloClient, ApolloQueryResult } from 'apollo-client'
import { Observable as ZenObservable } from 'apollo-link'
import gql from 'graphql-tag'
import { from, Observable, Observer, of } from 'rxjs'
import { catchError, concat, filter, map } from 'rxjs/operators'
import { DAO } from './dao'
import { Operation } from './operation'
import { Address } from './types'
import { createApolloClient, getWeb3Options } from './utils'

const Web3 = require('web3')

export interface IContractAddresses {
  base: { [key: string]: Address }
  dao: { [key: string]: Address }
}

export class Arc {
  public graphqlHttpProvider: string
  public graphqlWsProvider: string
  public web3HttpProvider: string
  public web3WsProvider: string

  public pendingOperations: Observable<Array<Operation<any>>> = of()
  public apolloClient: ApolloClient<object>
  // TODO: are there proper Web3 types available?
  public web3: any
  public contractAddresses: IContractAddresses

  constructor(options: {
    graphqlHttpProvider: string
    graphqlWsProvider: string
    web3HttpProvider?: string
    web3WsProvider?: string
    contractAddresses?: IContractAddresses
  }) {
    this.graphqlHttpProvider = options.graphqlHttpProvider
    this.graphqlWsProvider = options.graphqlWsProvider
    this.web3HttpProvider = options.web3HttpProvider || ''
    this.web3WsProvider = options.web3WsProvider || ''

    this.apolloClient = createApolloClient({
      graphqlHttpProvider: this.graphqlHttpProvider,
      graphqlWsProvider: this.graphqlWsProvider
    })

    if (this.web3HttpProvider) {
      this.web3 = new Web3(Web3.givenProvider || this.web3WsProvider || this.web3HttpProvider)
    }
    this.contractAddresses = options.contractAddresses || { base: {}, dao: {}}
  }

  /**
   * [dao description]
   * @param  address address of the dao Avatar
   * @return an instance of a DAO
   */
  public dao(address: Address): DAO {
    return new DAO(address, this)
  }

  public daos(): Observable<DAO[]> {
    const query = gql`
      {
        daos {
          id
        }
      }
    `
    return this._getObservableList(
      query,
      (r: any) => new DAO(r.id, this)
    ) as Observable<DAO[]>
  }

  /**
   * getBalance returns an observer with a stream of ETH balances
   * @param  address [description]
   * @return         [description]
   */
  public getBalance(address: Address): Observable<number> {
    // const web3 = new Web3(this.web3WsProvider)
    // observe balance on new blocks
    // (note that we are basically doing expensive polling here)
    const balanceObservable = Observable.create((observer: any) => {
      this.web3.eth.subscribe('newBlockHeaders', (err: Error, result: any) => {
        if (err) {
          console.log(err)
          observer.error(err)
        } else {
          console.log('newblock')
          this.web3.eth.getBalance(address).then((balance: any) => {
            // TODO: we should probably only call next if the balance has changed
            observer.next(balance)
          })
        }
      })
    })
    // get the current balance ad start observing new blocks for balace changes
    const queryObservable = from(this.web3.eth.getBalance(address)).pipe(
      concat(balanceObservable)
    )
    return queryObservable as Observable<any>
  }

  /**
   * Returns an observable that:
   * - sends a query over http and returns the current list of results
   * - subscribes over a websocket to changes, and returns the updated list
   * example:
   *    const query = gql`
   *    {
   *      daos {
   *        id
   *        address
   *      }
   *    }`
   *    _getObservableList(query, (r:any) => new DAO(r.address))
   *
   * @param query The query to be run
   * @param  entity  name of the graphql entity to be queried.
   * @param  itemMap (optional) a function that takes elements of the list and creates new objects
   * @return
   */
  public _getObservableList(
    query: any,
    itemMap: (o: object) => object = (o) => o
  ) {
    const entity = query.definitions[0].selectionSet.selections[0].name.value
    return this.getObservable(query).pipe(
      map((r) => {
        if (!r.data[entity]) { throw Error(`Could not find entity "${entity}" in ${Object.keys(r.data)}`)}
        return r.data[entity]
      }),
      map((rs: object[]) => rs.map(itemMap))
    )
  }

  /**
   * Returns an observable that:
   * - sends a query over http and returns the current list of results
   * - subscribes over a websocket to changes, and returns the updated list
   * example:
   *    const query = gql`
   *    {
   *      daos {
   *        id
   *        address
   *      }
   *    }`
   *    _getObservableList(query, (r:any) => new DAO(r.address), filter((r:any) => r.address === "0x1234..."))
   *
   * @param query The query to be run
   * @param  entity  name of the graphql entity to be queried.
   * @param  itemMap (optional) a function that takes elements of the list and creates new objects
   * @param filter filter the results
   * @return
   */
  public _getObservableListWithFilter(
    query: any,
    itemMap: (o: object) => object = (o) => o,
    filterFunc: (o: object) => boolean,
    apolloQueryOptions: IApolloQueryOptions = {}
  ) {
    const entity = query.definitions[0].selectionSet.selections[0].name.value
    return this.getObservable(query, apolloQueryOptions).pipe(
      map((r: any) => {
        if (!r.data[entity]) { throw Error(`Could not find ${entity} in ${r.data}`)}
        return r.data[entity]
      }),
      filter((rs) => rs.filter(filterFunc)),
      map((rs: object[]) => rs.map(itemMap))
    )
  }

  public _getObservableObject(
    query: any,
    entity: string,
    itemMap: (o: object) => object = (o) => o
  ) {
    return this.getObservable(query).pipe(
      map((r: any) => {
        if (!r.data) {
          return null
        }
        return r.data[entity]
      }),
      map(itemMap)
    )
  }

  public getObservable(query: any, apolloQueryOptions: IApolloQueryOptions = {}) {
    const subscriptionQuery = gql`
      subscription ${query}
    `

    // console.log(`creating observable for query:\n${query.loc.source.body}`)
    const zenObservable: ZenObservable<object[]> = this.apolloClient.subscribe<object[]>({ query: subscriptionQuery })
    const subscriptionObservable = Observable.create((observer: Observer<object[]>) => {
      const subscription = zenObservable.subscribe(observer)
      return () => subscription.unsubscribe()
    })

    const queryPromise: Promise<ApolloQueryResult<{[key: string]: object[]}>> = this.apolloClient.query(
      { query, ...apolloQueryOptions, fetchPolicy: 'no-cache' })

    const queryObservable = from(queryPromise).pipe(
      concat(subscriptionObservable)
    ).pipe(
      catchError((err: Error) => {
        throw Error(`${err.name}: ${err.message}\n${query.loc.source.body}`)
      })
    )

    return queryObservable as Observable<any>
  }

  public getContract(name: string) {
    // TODO: we are taking the default contracts from the migration repo adn assume
    // that they are the ones used by the current DAO. This assumption is only valid
    // on our controlled test environment. Should get the correct contracts instead
    const opts = getWeb3Options(this.web3)
    const addresses = this.contractAddresses
    let contractClass
    let contract
    switch (name) {
      case 'AbsoluteVote':
        contractClass = require('@daostack/arc/build/contracts/AbsoluteVote.json')
        contract = new this.web3.eth.Contract(contractClass.abi, addresses.base.AbsoluteVote, opts)
        return contract
      case 'ContributionReward':
        contractClass = require('@daostack/arc/build/contracts/ContributionReward.json')
        contract = new this.web3.eth.Contract(contractClass.abi, addresses.base.ContributionReward, opts)
        return contract
      case 'GenesisProtocol':
        contractClass = require('@daostack/arc/build/contracts/GenesisProtocol.json')
        contract = new this.web3.eth.Contract(contractClass.abi, addresses.base.GenesisProtocol, opts)
        return contract
      default:
        throw Error(`Unknown contract: ${name}`)
    }
  }

  public sendQuery(query: any) {
    const queryPromise = this.apolloClient.query({ query })
    return queryPromise
  }
}

export interface IApolloQueryOptions {
  fetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only' | 'cache-only' | 'no-cache' | 'standby'
}
