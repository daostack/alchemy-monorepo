import { ApolloClient, ApolloQueryResult } from 'apollo-client'
import { Observable as ZenObservable } from 'apollo-link'
import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable, Observer, of, Subscription } from 'rxjs'
import { catchError, filter, map } from 'rxjs/operators'
import { DAO } from './dao'
import { Logger } from './logger'
import { Operation, sendTransaction, web3receipt } from './operation'
import { Token } from './token'
import { Address, IPFSProvider, Web3Provider } from './types'
import { createApolloClient, getWeb3Options, isAddress, zenToRxjsObservable } from './utils'
const IPFSClient = require('ipfs-http-client')
const Web3 = require('web3')

export class Arc {
  public graphqlHttpProvider: string
  public graphqlWsProvider: string
  public web3Provider: Web3Provider = ''
  public ipfsProvider: IPFSProvider

  public pendingOperations: Observable<Array<Operation<any>>> = of()
  public apolloClient: ApolloClient<object>

  public ipfs: any
  public web3: any
  public contractAddresses: IContractAddresses | undefined

  // accounts obseved by ethBalance
  public blockHeaderSubscription: Subscription|undefined = undefined
  public observedAccounts: { [address: string]: {
      observable?: Observable<BN>,
      observer?: Observer<BN>,
      lastBalance?: number
      subscriptionsCount: number
    }
  } = {}

  constructor(options: {
    graphqlHttpProvider: string
    graphqlWsProvider: string
    web3Provider?: string
    ipfsProvider?: IPFSProvider
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

  public ethBalance(owner: Address): Observable<BN> {
    if (!this.observedAccounts[owner]) {
      this.observedAccounts[owner] = {
        subscriptionsCount: 1
       }
    }
    if (this.observedAccounts[owner].observable) {
        this.observedAccounts[owner].subscriptionsCount += 1
        return this.observedAccounts[owner].observable as Observable<BN>
    }

    const observable = Observable.create((observer: Observer<BN>) => {
      this.observedAccounts[owner].observer = observer

      // get the current balance and return it
      this.web3.eth.getBalance(owner).then((currentBalance: number) => {
        const accInfo = this.observedAccounts[owner];
        (accInfo.observer as Observer<BN>).next(new BN(currentBalance))
        accInfo.lastBalance = currentBalance
      })
      // set up the blockheadersubscription if it does not exist yet
      if (!this.blockHeaderSubscription) {
        this.blockHeaderSubscription = this.web3.eth.subscribe('newBlockHeaders', (err: Error) => {
          Object.keys(this.observedAccounts).forEach((addr) => {
            const accInfo = this.observedAccounts[addr]
            if (err) {
            (accInfo.observer as Observer<BN>).error(err)
            } else {
              this.web3.eth.getBalance(addr).then((balance: any) => {
                if (balance !== accInfo.lastBalance) {
                  (accInfo.observer as Observer<BN>).next(new BN(balance))
                  accInfo.lastBalance = balance
                }
              })
            }
          })
        })
      }
      // unsubscribe
      return( ) => {
        this.observedAccounts[owner].subscriptionsCount -= 1
        if (this.observedAccounts[owner].subscriptionsCount <= 0) {
          delete this.observedAccounts[owner]
        }
        if (Object.keys(this.observedAccounts).length === 0 && this.blockHeaderSubscription) {
          this.blockHeaderSubscription.unsubscribe()
          this.blockHeaderSubscription = undefined
        }
      }
    })

    this.observedAccounts[owner].observable = observable
    return observable
      .pipe(map((item: any) => new BN(item)))
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

      if (!apolloQueryOptions.fetchPolicy) {
        apolloQueryOptions.fetchPolicy = 'network-only'
      }

      // subscriptionQuery subscribes to get notified of updates to the query
      const subscriptionQuery = gql`
          subscription ${query}
        `
      // subscribe
      const zenObservable: ZenObservable<object[]> = this.apolloClient.subscribe<object[]>({
        fetchPolicy: 'network-only',
        query: subscriptionQuery
       })
      zenObservable.subscribe((next: any) => {
          this.apolloClient.writeQuery({
            data: next.data,
            query
          })
      })

      const sub = zenToRxjsObservable(
        this.apolloClient.watchQuery({
          fetchPolicy: 'cache-and-network',
          fetchResults: true,
          query
        })
      )
        .pipe(
          filter((r: ApolloQueryResult<any>) => {
            return !r.loading
          }), // filter empty results
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
    itemMap: (o: object) => object | null = (o) => o,
    apolloQueryOptions: IApolloQueryOptions = {}
  ) {
    const entity = query.definitions[0].selectionSet.selections[0].name.value
    return this.getObservable(query, apolloQueryOptions).pipe(
      map((r: ApolloQueryResult<any>) => {
        if (!r.data[entity]) {
          throw Error(`Could not find entity '${entity}' in ${Object.keys(r.data)}`)
        }
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
    itemMap: (o: object) => object | null = (o) => o,
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
    itemMap: (o: object) => object | null = (o) => o,
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

  /**
   * get a web3 contract instance for the deployed contract with the given name
   * @param  name [description]
   * @return a web3 Contract instance
   */
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
      case 'Redeemer':
        contractClass = require('@daostack/arc/build/contracts/Redeemer.json')
        contract = new this.web3.eth.Contract(contractClass.abi, addresses.base.Redeemer, opts)
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

  public getAccount(): Observable < Address > {
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

  public setAccount(address: Address) {
    this.web3.eth.accounts.wallet[0] = address
    this.web3.eth.defaultAccount = address
  }

  public approveForStaking(amount: BN) {
    return this.GENToken().approveForStaking(amount)
  }

  /**
   * How much GEN the genesisProtocol may spend on behalve of the owner
   * @param  owner owner for which to check the allowance
   * @return An allowance { amount: BN, owner: string, spender: string }
   */
  public allowance(owner: string): Observable < BN > {
    const genesisProtocol = this.getContract('GenesisProtocol')
    const spender = genesisProtocol.options.address
    return this.GENToken().allowance(owner, spender)
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
