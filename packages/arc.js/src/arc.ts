import BN = require('bn.js')
import gql from 'graphql-tag'
import { Observable, Observer, of, Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import { DAO, IDAOQueryOptions } from './dao'
import { GraphNodeObserver, IApolloQueryOptions } from './graphnode'
export { IApolloQueryOptions } from './graphnode'
import { Event, IEventQueryOptions } from './event'
import { IPFSClient } from './ipfsClient'
import { Logger } from './logger'
import { Operation, sendTransaction, transactionErrorHandler, web3receipt } from './operation'
import { IProposalQueryOptions, Proposal } from './proposal'
import { IRewardQueryOptions, Reward } from './reward'
import { ISchemeQueryOptions, Scheme } from './scheme'
import { ABI_DIR } from './settings'
import { IStakeQueryOptions, Stake } from './stake'
import { ITagQueryOptions, Tag } from './tag'
import { Token } from './token'
import { Address, IPFSProvider, Web3Provider } from './types'
import { isAddress } from './utils'
const Web3 = require('web3')

/**
 * The Arc class holds all configuration.
 * Any useage of the library typically will start with instantiating a new Arc instance
 * @return an instance of Arc
 */
export class Arc extends GraphNodeObserver {
  public web3Provider: Web3Provider = ''
  public web3ProviderRead: Web3Provider = ''
  public ipfsProvider: IPFSProvider

  public pendingOperations: Observable<Array<Operation<any>>> = of()

  public ipfs: any
  public web3: typeof Web3
  public web3Read: typeof Web3 // if provided, arc will read all data from this provider
  /**
   * a mapping of contrct names to contract addresses
   */
  public contractInfos: IContractInfo[]
  public contracts: { [key: string]: any } = {} // a cache for the contracts
  public contractsR: { [key: string]: any } = {} // a cache for teh 'read-only' contracts

  // accounts observed by ethBalance
  public blockHeaderSubscription: Subscription | undefined = undefined
  public observedAccounts: {
    [address: string]: {
      observable?: Observable<BN>
      observer?: Observer<BN>
      lastBalance?: string
      subscriptionsCount: number
    }
  } = {}

  constructor(options: {
    /** Information about the contracts. Cf. [[setContractInfos]] and [[fetchContractInfos]] */
    contractInfos?: IContractInfo[]
    graphqlHttpProvider?: string
    graphqlWsProvider?: string
    ipfsProvider?: IPFSProvider
    web3Provider?: string
    web3ProviderRead?: string
    /** this function will be called before a query is sent to the graphql provider */
    graphqlPrefetchHook?: (query: any) => void
    /** determines whether a query should subscribe to updates from the graphProvider. Default is true.  */
    graphqlSubscribeToQueries?: boolean
    /** an apollo-retry-link instance as https://www.apollographql.com/docs/link/links/retry/#default-configuration */
    graphqlRetryLink?: any,
    graphqlErrHandler?: any
  }) {
    super({
      errHandler: options.graphqlErrHandler,
      graphqlHttpProvider: options.graphqlHttpProvider,
      graphqlSubscribeToQueries: options.graphqlSubscribeToQueries,
      graphqlWsProvider: options.graphqlWsProvider,
      prefetchHook: options.graphqlPrefetchHook,
      retryLink: options.graphqlRetryLink
    })
    this.ipfsProvider = options.ipfsProvider || ''

    if (options.web3Provider) {
      this.web3 = new Web3(options.web3Provider)
    }
    if (options.web3ProviderRead) {
      this.web3Read = new Web3(options.web3ProviderRead)
    } else {
      this.web3Read = this.web3
    }

    this.contractInfos = options.contractInfos || []
    if (!this.contractInfos) {
      Logger.warn('No contract addresses given to the Arc.constructor: expect most write operations to fail!')
    }

    if (this.ipfsProvider) {
      this.ipfs = new IPFSClient(this.ipfsProvider)
    }

    // by default, we subscribe to queries
    if (options.graphqlSubscribeToQueries === undefined) {
      options.graphqlSubscribeToQueries = true
    }
  }

  /**
   * set the contract addresses
   * @param  contractInfos a list of IContractInfo objects
   * @return
   */
  public async setContractInfos(contractInfos: IContractInfo[]) {
    // reset the cache
    this.contracts = {}
    this.contractsR = {}
    this.contractInfos = contractInfos
  }

  /**
   * fetch contractInfos from the subgraph
   * @return a list of IContractInfo instances
   */
  public async fetchContractInfos(apolloQueryOptions: IApolloQueryOptions = {}): Promise<IContractInfo[]> {
    const query = gql`query AllContractInfos {
      contractInfos (first: 1000) {
        id
        name
        version
        address
        alias
      }
    }`
    // const result = await this.getObservableList(query, itemMap, apolloQueryOptions).pipe(first()).toPromise()
    const response = await this.sendQuery(query, apolloQueryOptions)
    const result = response.data.contractInfos as IContractInfo[]
    this.setContractInfos(result)
    return result
  }

  /**
   * get a DAO instance from an address
   * @param  address address of the dao Avatar
   * @return an instance of a DAO
   */
  public dao(address: Address): DAO {
    isAddress(address)
    return new DAO(address, this)
  }

  /**
   * return an observable of the list of DAOs
   * @param options options to pass on to the query
   * @return [description]
   */
  public daos(options: IDAOQueryOptions = {}, apolloQueryOptions: IApolloQueryOptions = {}): Observable<DAO[]> {
    return DAO.search(this, options, apolloQueryOptions)
  }

  public tags(options: ITagQueryOptions = {}, apolloQueryOptions: IApolloQueryOptions = {}): Observable<Tag[]> {
    return Tag.search(this, options, apolloQueryOptions)
  }

  public scheme(id: string): Scheme {
    return new Scheme(id, this)
  }

  public schemes(
    options: ISchemeQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<Scheme[]> {
    return Scheme.search(this, options, apolloQueryOptions)
  }

  public proposal(id: string): Proposal {
    return new Proposal(id, this)
  }

  public proposals(
    options: IProposalQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<Proposal[]> {
    return Proposal.search(this, options, apolloQueryOptions)
  }

  public events(
    options: IEventQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<Event[]> {
    return Event.search(this, options, apolloQueryOptions)
  }

  public rewards(
    options: IRewardQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<Reward[]> {
    return Reward.search(this, options, apolloQueryOptions)
  }

  public stakes(
    options: IStakeQueryOptions = {},
    apolloQueryOptions: IApolloQueryOptions = {}
  ): Observable<Stake[]> {
    return Stake.search(this, options, apolloQueryOptions)
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
      this.web3Read.eth.getBalance(owner)
        .then((currentBalance: string) => {
          const accInfo = this.observedAccounts[owner];
          (accInfo.observer as Observer<BN>).next(new BN(currentBalance))
          accInfo.lastBalance = currentBalance
        })
        .catch((err: Error) => observer.error(err))

      // set up the blockheadersubscription if it does not exist yet
      if (!this.blockHeaderSubscription) {
        const subscribeToBlockHeaders = () => {
          this.blockHeaderSubscription = this.web3Read.eth.subscribe('newBlockHeaders', async (err: Error) => {
            Object.keys(this.observedAccounts).forEach(async (addr) => {
              const accInfo = this.observedAccounts[addr]
              if (err) {
                (accInfo.observer as Observer<BN>).error(err)
              } else {
                try {
                  const balance = await this.web3Read.eth.getBalance(addr)
                  if (balance !== accInfo.lastBalance) {
                    (accInfo.observer as Observer<BN>).next(new BN(balance))
                    accInfo.lastBalance = balance
                  }
                } catch (err) {
                  observer.error(err)
                }
              }
            })
          })
        }
        try {
          subscribeToBlockHeaders()
        } catch (err) {
          if (err.message.match(/connection not open/g)) {
            // we need to re-establish the connection and then resubscribe
            this.web3.setProvider(this.web3Provider)
            subscribeToBlockHeaders()
          }
          throw err
        }
      }
      // unsubscribe
      return () => {
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
   * return information about the contract
   * @param  address [description]
   * @return      an IContractInfo instance
   */
  public getContractInfo(address: Address) {
    isAddress(address)
    for (const contractInfo of this.contractInfos) {
      if (contractInfo.address.toLowerCase() === address.toLowerCase()) {
        return contractInfo
      }
    }
    if (!this.contractInfos) {
      throw Error(`no contract info was found - did you call "arc.setContractInfos()"?`)
    }
    throw Error(`No contract with address ${address} is known`)
  }

  public getContractInfoByName(name: string, version: string) {
    for (const contractInfo of this.contractInfos) {
      if (contractInfo.name === name && contractInfo.version === version) {
        return contractInfo
      }
    }
    if (!this.contractInfos) {
      throw Error(`no contract info was found - did you call "arc.setContractInfos(...)"?`)
    }
    throw Error(`No contract with name ${name}  and version ${version} is known`)
  }

  public getABI(address?: Address, abiName?: string, version?: string) {
    if (address && !abiName || !version) {
      const contractInfo = this.getContractInfo(address as Address)
      abiName = contractInfo.name
      version = contractInfo.version
      if (abiName === 'GEN') {
        abiName = 'ERC20'
      }
    }
    // TODO: workaround for https://github.com/daostack/subgraph/pull/336
    if (abiName === 'UGenericScheme') {
      const versionNumber = Number(version.split('rc.')[1])
      if (versionNumber < 24) {
        abiName = 'GenericScheme'
      }
    }
    // //End of workaround

    let artefact = require(`${ABI_DIR}/${version}/${abiName}.json`)
    if (artefact.rootVersion) {
      artefact = require(`${ABI_DIR}/${artefact.rootVersion}/${abiName}.json`)
    }
    return artefact.abi
  }

  /**
   * return a web3 Contract instance.
   * @param  address address of the contract to look up in self.contractInfos
   * @param  [abiName] (optional) name of the ABI (i.e. 'Avatar' or 'SchemeRegistrar').
   * @param  [version] (optional) Arc version of contract (https://www.npmjs.com/package/@daostack/arc)
   * @return   a web3 contract instance
   */
  public getContract(address: Address, abi?: any, mode?: 'readonly') {
    // we use a contract "cache" because web3 contract instances add an event listener

    const readonlyContract = (mode === 'readonly' && this.web3Read !== this.web3)
    if (readonlyContract && this.contractsR[address]) {
      return this.contractsR[address]
    } else if (this.contracts[address]) {
      return this.contracts[address]
    } else {
      if (!abi) {
        abi = this.getABI(address)
      }
      let contract: any
      if (readonlyContract) {
        contract = new this.web3Read.eth.Contract(abi, address)
        this.contractsR[address] = contract
      } else {
        contract = new this.web3.eth.Contract(abi, address)
        this.contracts[address] = contract
      }
      return contract
    }
  }

  /**
   * get the GEN Token
   * @return a Token instance
   */
  public GENToken() {
    if (this.contractInfos) {
      for (const contractInfo of this.contractInfos) {
        if (contractInfo.name === 'GEN') {
          return new Token(contractInfo.address, this)
        }
      }
      throw Error(`Cannot find address of GEN Token - did you call setContractInfos?`)
    } else {
      throw Error(`No contract addresses known - did you run arc.setContractInfos()?`)
    }
  }

  /**
   * verify scheme parametersHash
   * @param  address address of the scheme to verify its params hash
   * @param  schemeParametersHash the scheme params hash
   * @param  schemeName optional
   * @return true if :
   *   scheme is not one of the following:
   *    'SchemeRegistrar','ContributionReward','GenericScheme','GenericSchemeMultiCall'
   *   or
   *    parameters are verified for this scheme,
   *  otherwise - will return false
   */
  public async verifyParametersHash(address: Address, schemeParametersHash: string, schemeName?: string) {
    let contractInfo
    if (!schemeName) {
        try {
           contractInfo = this.getContractInfo(address)
           schemeName = contractInfo.name
        } catch (error) {
           return false
        }
    }
    let contract
    try {
      contract = await this.getContract(address)
    } catch (error) {
       return true
    }

    if (schemeName === 'SchemeRegistrar' || schemeName === 'ContributionReward') {
      const parameters = await contract.methods.parameters(schemeParametersHash).call()
      switch (schemeName) {
        case 'SchemeRegistrar':
          return (this.validateGenesisProtocolParams(parameters[2], parameters[0]) &&
                  this.validateGenesisProtocolParams(parameters[2], parameters[1]))
        case 'ContributionReward':
          return this.validateGenesisProtocolParams(parameters[1], parameters[0])
     }
   }
    if (schemeName === 'GenericScheme' ||
       schemeName === 'GenericSchemeMultiCall' ||
       schemeName === 'ContributionRewardExt') {
      const votingMachine = await contract.methods.votingMachine().call()
      const voteParams = await contract.methods.voteParams().call()
      return this.validateGenesisProtocolParams(votingMachine, voteParams)
    }
    return true
 }

  public getAccount(): Observable<Address> {
    // this complex logic is to get the correct account both from the Web3 as well as from the Metamaask provider
    // This polls for changes. But polling is Evil!
    // cf. https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#ear-listening-for-selected-account-changes
    return Observable.create((observer: any) => {
      const interval = 1000 /// poll once a second
      let account: any
      let prevAccount: any
      const web3 = this.web3
      if (web3.eth.accounts[0]) {
        observer.next(web3.eth.accounts[0].address)
        prevAccount = web3.eth.accounts[0].address
      } else if (web3.eth.defaultAccount) {
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
      return () => clearTimeout(timeout)
    })
  }

  public setAccount(address: Address) {
    this.web3.eth.defaultAccount = address
  }

  public approveForStaking(spender: Address, amount: BN) {
    return this.GENToken().approveForStaking(spender, amount)
  }

  /**
   * How much GEN spender may spend on behalve of the owner
   * @param  owner Address of the owner of the tokens
   * @param  spender Address of the spender
   * @return
   */
  public allowance(owner: Address, spender: Address): Observable<BN> {
    return this.GENToken().allowance(owner, spender)
  }

  /**
   * send an Ethereum transaction
   * @param  transaction  [description]
   * @param  mapToObject  [description]
   * @param  errorHandler [description]
   * @return  An observable of
   */
  public sendTransaction<T>(
    transaction: any,
    mapToObject: (receipt: web3receipt) => T,
    errorHandler?: transactionErrorHandler
  ): Operation<T> {
    return sendTransaction(this, transaction, mapToObject, errorHandler)
  }

  /**
   * save data of a proposal to IPFS, return  the IPFS hash
   * @param  options an Object to save. This object must have title, url and desction defined
   * @return  a Promise that resolves in the IPFS Hash where the file is saved
   */
  public async saveIPFSData(options: { title?: string, url?: string, description?: string, tags?: string[] }):
    Promise<string> {
    let ipfsDataToSave: object = {}
    if (options.title || options.url || options.description || options.tags !== undefined) {
      if (!this.ipfsProvider) {
        throw Error(`No ipfsProvider set on Arc instance - cannot save data on IPFS`)
      }
      ipfsDataToSave = {
        description: options.description,
        tags: options.tags,
        title: options.title,
        url: options.url
      }
    }
    Logger.debug('Saving data on IPFS...')
    let descriptionHash: string = ''
    try {
      descriptionHash = await this.ipfs.addString(JSON.stringify(ipfsDataToSave))
      // pin the file
      await this.ipfs.pinHash(descriptionHash)
    } catch (error) {
      throw error
    }
    Logger.debug(`Data saved successfully as ${descriptionHash}`)
    return descriptionHash
  }

  private async validateGenesisProtocolParams(gpAddress: Address, parametersHash: string) {
      let genesisProtocol
      try {
         isAddress(gpAddress)
         genesisProtocol = await this.getContract(gpAddress)
      } catch (error) {
         return false
      }
      const parameters = await genesisProtocol.methods.parameters(parametersHash).call()
      return parameters[0] >= 50
  }
}

export interface IContractAddresses {
  [key: string]: Address
}

export interface IContractInfo {
  id: string
  version: string
  address: Address
  name: string
  alias: string
}
