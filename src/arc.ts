import { ApolloClient, ApolloQueryResult } from 'apollo-client'
import { Observable as ZenObservable } from 'apollo-link'
import BN = require('bn.js')
import gql from 'graphql-tag'
import { from, Observable, Observer, of } from 'rxjs'
import { catchError, concat, filter, map } from 'rxjs/operators'
import { DAO } from './dao'
import { Logger } from './logger'
import { Operation, sendTransaction, web3receipt } from './operation'
import { Token } from './token'
import { Address, Web3Provider } from './types'
import { createApolloClient, getWeb3Options, isAddress } from './utils'

const IPFSClient = require('ipfs-http-client')
const Web3 = require('web3')

export class Arc {
  public graphqlHttpProvider: string
  public graphqlWsProvider: string
  public web3Provider: Web3Provider = ''
  public ipfsProvider: string

  public pendingOperations: Observable<Array<Operation<any>>> = of()
  public apolloClient: ApolloClient<object>

  public ipfs: any
  public web3: any
  public contractAddresses: IContractAddresses | undefined

  constructor(options: {
    graphqlHttpProvider: string
    graphqlWsProvider: string
    web3Provider?: string
    ipfsProvider?: string
    contractAddresses?: IContractAddresses
  }) {
    this.graphqlHttpProvider = options.graphqlHttpProvider
    this.graphqlWsProvider = options.graphqlWsProvider
    this.ipfsProvider = options.ipfsProvider || ''

    this.apolloClient = createApolloClient({
      graphqlHttpProvider: this.graphqlHttpProvider,
      graphqlWsProvider: this.graphqlWsProvider
    })

    let web3provider: any

    // TODO: this is probably better to handle explicitly in the frontend
    // check if we have a web3 provider set in the window object (in the browser)
    // cf. https://metamask.github.io/metamask-docs/API_Reference/Ethereum_Provider
    if (typeof window !== 'undefined' &&
      (typeof (window as any).ethereum !== 'undefined' || typeof (window as any).web3 !== 'undefined')
    ) {
      // Web3 browser user detected. You can now use the provider.
      web3provider = (window as any).ethereum || (window as any).web3.currentProvider
    } else {
      web3provider = Web3.givenProvider || options.web3Provider
    }

    if (web3provider) {
      this.web3 = new Web3(web3provider)
    }

    if (!options.contractAddresses) {
      Logger.warn('No contract addresses given to the Arc.constructor: expect most write operations to fail!')
    } else {
      this.contractAddresses = options.contractAddresses
    }

    if (this.ipfsProvider) {
      this.ipfs = IPFSClient(this.ipfsProvider)
    }
  }

  /**
   * [dao description]
   * @param  address address of the dao Avatar
   * @return an instance of a DAO
   */
  public dao(address: Address): DAO {
    isAddress(address)
    return new DAO(address, this)
  }

  public daos(): Observable < DAO[] > {
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
  public getBalance(address: Address): Observable<BN> {
    // observe balance on new blocks
    // (note that we are basically doing expensive polling here)
    const balanceObservable = Observable.create((observer: any) => {
      const subscription = this.web3.eth.subscribe('newBlockHeaders', (err: Error, result: any) => {
        if (err) {
          observer.error(err)
        } else {
          this.web3.eth.getBalance(address).then((balance: any) => {
            // TODO: we should probably only call next if the balance has changed
            observer.next(new BN(balance))
          })
        }
      })
      return () => subscription.unsubscribe()
    })
    // get the current balance ad start observing new blocks for balace changes
    const queryObservable = from(this.web3.eth.getBalance(address)).pipe(
      concat(balanceObservable)
    )
    return queryObservable as Observable<any>
  }

  /**
   * Given a gql query, will return an observable of query results
   * @param  query              a gql query object to execute
   * @param  apolloQueryOptions options to pass on to Apollo, cf ..
   * @return an Obsevable that will first yield the current result, and yields updates every time the data changes
   */
  public getObservable(query: any, apolloQueryOptions: IApolloQueryOptions = {}) {

    return Observable.create(async (observer: Observer<ApolloQueryResult<any>>) => {
      Logger.debug(query.loc.source.body)

      // queryPromise sends a query and featches the results
      const queryPromise: Promise<ApolloQueryResult<{[key: string]: object[]}>> = this.apolloClient.query(
        { query, ...apolloQueryOptions })

      // subscriptionQuery subscribes to get notified of updates to the query
      const subscriptionQuery = gql`
          subscription ${query}
        `
      // subscribe
      const zenObservable: ZenObservable<object[]> = this.apolloClient.subscribe<object[]>({ query: subscriptionQuery })
      // convert the zenObservable returned by appolloclient to an rx.js.Observable
      const subscriptionObservable = Observable.create((obs: Observer<any>) => {
          const subscription = zenObservable.subscribe(obs)
          return () => subscription.unsubscribe()
        })

      // concatenate the two queries: first the simple fetch result, then the updates from the subscription
      const sub = from(queryPromise)
        .pipe(
          concat(subscriptionObservable)
        )
        .pipe(
          catchError((err: Error) => {
            throw Error(`${err.name}: ${err.message}\n${query.loc.source.body}`)
          })
        )
        .subscribe(observer)
      return () => sub.unsubscribe()
    })
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
    itemMap: (o: object) => object|null = (o) => o,
    apolloQueryOptions: IApolloQueryOptions = {}
  ) {
    const entity = query.definitions[0].selectionSet.selections[0].name.value
    return this.getObservable(query, apolloQueryOptions).pipe(
      map((r: ApolloQueryResult<any>) => {
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
    itemMap: (o: object) => object|null = (o) => o,
    filterFunc: (o: object) => boolean,
    apolloQueryOptions: IApolloQueryOptions = {}
  ) {
    const entity = query.definitions[0].selectionSet.selections[0].name.value
    return this.getObservable(query, apolloQueryOptions).pipe(
      map((r: ApolloQueryResult<object[]>) => {
        if (!r.data[entity]) { throw Error(`Could not find ${entity} in ${r.data}`)}
        return r.data[entity]
      }),
      filter(filterFunc),
      map((rs: object[]) => rs.map(itemMap))
    )
  }

  public _getObservableObject(
    query: any,
    itemMap: (o: object) => object|null = (o) => o,
    apolloQueryOptions: IApolloQueryOptions = {}
  ) {
    const entity = query.definitions[0].selectionSet.selections[0].name.value

    return this.getObservable(query, apolloQueryOptions).pipe(
      map((r: ApolloQueryResult<any>) => {
        if (!r.data) {
          return null
        }
        return r.data[entity]
      }),
      map(itemMap)
    )
  }

  public getContract(name: string) {
    // TODO: we are taking the default contracts from the migration repo and assume
    // that they are the ones used by the current DAO. This assumption is only valid
    // on our controlled test environment. Should get the correct contracts instead
    const opts = getWeb3Options(this.web3)
    const addresses = this.contractAddresses
    if (!addresses) {
      throw new Error(`Cannot get contract: no contractAddress set`)
    }
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
      case 'GEN':
        contractClass = require('@daostack/arc/build/contracts/DAOToken.json')
        contract = new this.web3.eth.Contract(contractClass.abi, addresses.base.GEN, opts)
        return contract
      case 'GenesisProtocol':
        contractClass = require('@daostack/arc/build/contracts/GenesisProtocol.json')
        contract = new this.web3.eth.Contract(contractClass.abi, addresses.base.GenesisProtocol, opts)
        return contract
      case 'Reputation':
        contractClass = require('@daostack/arc/build/contracts/Reputation.json')
        contract = new this.web3.eth.Contract(contractClass.abi, addresses.dao.Reputation, opts)
        return contract
      default:
        throw Error(`Unknown contract: ${name}`)
    }
  }

  public GENToken() {
    if (this.contractAddresses) {
      return new Token(this.contractAddresses.base.GEN, this)
    } else {
      throw Error(`Cannot get GEN Token because no contract addresses were provided`)
    }
  }

  public getAccount(): Observable<Address> {
    // this complex logic is to get the correct account both from the Web3 as well as from the Metamaask provider
    // Polling is Evil!
    // cf. https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#ear-listening-for-selected-account-changes
    return Observable.create((observer: any) => {
      const interval = 1000 /// poll once a second
      let account: any
      let prevAccount: any
      const web3 = this.web3
      if (web3.eth.accounts[0]) {
        observer.next(web3.eth.accounts[0].address)
        prevAccount = web3.eth.accounts[0].address
      } else if (web3.eth.defaultAccount ) {
        observer.next(web3.eth.defaultAccount)
        prevAccount = web3.eth.defaultAccount
      }
      const timeout = setInterval(() => {
        web3.eth.getAccounts().then((accounts: any) => {
          if (accounts) {
            account = accounts[0]
          } else if (web3.eth.accounts) {
            account = web3.eth.accounts[0].address
          }
          if (prevAccount !== account && account) {
            web3.eth.defaultAccount = account
            observer.next(account)
            prevAccount = account
          }
        })
      }, interval)
      return() => clearTimeout(timeout)
    })
  }

  public approveForStaking(amount: BN) {
    return this.GENToken().approveForStaking(amount)
  }
  /**
   * How much GEN the genesisProtocol may spend on behalve of the owner
   * @param  owner owner for which to check the allowance
   * @return A BN
   */
  public allowance(owner: string): Observable < any > {
    return this.GENToken().allowances({
      owner
    }).pipe(
      map((rs: object[]) => rs[0])
    )
  }

  public sendTransaction<T>(
    transaction: any,
    mapToObject: (receipt: web3receipt) => T,
    errorHandler: (error: Error) => Promise<Error> | Error = (error) => error
  ) {
    return sendTransaction(transaction, mapToObject, errorHandler, this)
  }
  public sendQuery(query: any) {
    const queryPromise = this.apolloClient.query({ query })
    return queryPromise
  }
}

export interface IApolloQueryOptions {
  fetchPolicy?: 'cache-first' | 'cache-and-network' | 'network-only' | 'cache-only' | 'no-cache' | 'standby'
}

export interface IContractAddresses {
  base: { [key: string]: Address }
  dao: { [key: string]: Address }
  organs: { [key: string]: Address }
  test: { [key: string]: Address }
}
