[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [Arc](arc.md)

# Class: Arc

The Arc class holds all configuration.
Any useage of the library typically will start with instantiating a new Arc instance

**`returns`** an instance of Arc

## Hierarchy

* [GraphNodeObserver](graphnodeobserver.md)

  ↳ **Arc**

## Index

### Constructors

* [constructor](arc.md#constructor)

### Properties

* [Logger](arc.md#logger)
* [apolloClient](arc.md#optional-apolloclient)
* [blockHeaderSubscription](arc.md#blockheadersubscription)
* [contractInfos](arc.md#contractinfos)
* [contracts](arc.md#contracts)
* [contractsR](arc.md#contractsr)
* [graphqlHttpProvider](arc.md#optional-graphqlhttpprovider)
* [graphqlSubscribeToQueries](arc.md#optional-graphqlsubscribetoqueries)
* [graphqlWsProvider](arc.md#optional-graphqlwsprovider)
* [ipfs](arc.md#ipfs)
* [ipfsProvider](arc.md#ipfsprovider)
* [observedAccounts](arc.md#observedaccounts)
* [pendingOperations](arc.md#pendingoperations)
* [web3](arc.md#web3)
* [web3Provider](arc.md#web3provider)
* [web3ProviderRead](arc.md#web3providerread)
* [web3Read](arc.md#web3read)

### Methods

* [GENToken](arc.md#gentoken)
* [allowance](arc.md#allowance)
* [approveForStaking](arc.md#approveforstaking)
* [dao](arc.md#dao)
* [daos](arc.md#daos)
* [ethBalance](arc.md#ethbalance)
* [events](arc.md#events)
* [fetchContractInfos](arc.md#fetchcontractinfos)
* [getABI](arc.md#getabi)
* [getAccount](arc.md#getaccount)
* [getContract](arc.md#getcontract)
* [getContractInfo](arc.md#getcontractinfo)
* [getContractInfoByName](arc.md#getcontractinfobyname)
* [getObservable](arc.md#getobservable)
* [getObservableList](arc.md#getobservablelist)
* [getObservableObject](arc.md#getobservableobject)
* [proposal](arc.md#proposal)
* [proposals](arc.md#proposals)
* [rewards](arc.md#rewards)
* [saveIPFSData](arc.md#saveipfsdata)
* [scheme](arc.md#scheme)
* [schemes](arc.md#schemes)
* [sendQuery](arc.md#sendquery)
* [sendTransaction](arc.md#sendtransaction)
* [setAccount](arc.md#setaccount)
* [setContractInfos](arc.md#setcontractinfos)
* [stakes](arc.md#stakes)
* [tags](arc.md#tags)
* [validateGenesisProtocolParams](arc.md#private-validategenesisprotocolparams)
* [verifyParametersHash](arc.md#verifyparametershash)

## Constructors

###  constructor

\+ **new Arc**(`options`: object): *[Arc](arc.md)*

*Overrides [GraphNodeObserver](graphnodeobserver.md).[constructor](graphnodeobserver.md#constructor)*

*Defined in [src/arc.ts:54](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L54)*

**Parameters:**

▪ **options**: *object*

Name | Type | Description |
------ | ------ | ------ |
`contractInfos?` | [IContractInfo](../interfaces/icontractinfo.md)[] | Information about the contracts. Cf. [setContractInfos](arc.md#setcontractinfos) and [fetchContractInfos](arc.md#fetchcontractinfos) |
`graphqlErrHandler?` | any | - |
`graphqlHttpProvider?` | undefined &#124; string | - |
`graphqlPrefetchHook?` | undefined &#124; function | this function will be called before a query is sent to the graphql provider |
`graphqlRetryLink?` | any | an apollo-retry-link instance as https://www.apollographql.com/docs/link/links/retry/#default-configuration |
`graphqlSubscribeToQueries?` | undefined &#124; false &#124; true | determines whether a query should subscribe to updates from the graphProvider. Default is true. |
`graphqlWsProvider?` | undefined &#124; string | - |
`ipfsProvider?` | [IPFSProvider](../globals.md#ipfsprovider) | - |
`web3Provider?` | undefined &#124; string | - |
`web3ProviderRead?` | undefined &#124; string | - |

**Returns:** *[Arc](arc.md)*

## Properties

###  Logger

• **Logger**: *GlobalLogger* =  Logger

*Inherited from [GraphNodeObserver](graphnodeobserver.md).[Logger](graphnodeobserver.md#logger)*

*Defined in [src/graphnode.ts:164](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/graphnode.ts#L164)*

___

### `Optional` apolloClient

• **apolloClient**? : *ApolloClient‹object›*

*Inherited from [GraphNodeObserver](graphnodeobserver.md).[apolloClient](graphnodeobserver.md#optional-apolloclient)*

*Defined in [src/graphnode.ts:165](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/graphnode.ts#L165)*

___

###  blockHeaderSubscription

• **blockHeaderSubscription**: *Subscription | undefined* =  undefined

*Defined in [src/arc.ts:46](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L46)*

___

###  contractInfos

• **contractInfos**: *[IContractInfo](../interfaces/icontractinfo.md)[]*

*Defined in [src/arc.ts:41](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L41)*

a mapping of contrct names to contract addresses

___

###  contracts

• **contracts**: *object*

*Defined in [src/arc.ts:42](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L42)*

#### Type declaration:

* \[ **key**: *string*\]: any

___

###  contractsR

• **contractsR**: *object*

*Defined in [src/arc.ts:43](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L43)*

#### Type declaration:

* \[ **key**: *string*\]: any

___

### `Optional` graphqlHttpProvider

• **graphqlHttpProvider**? : *undefined | string*

*Inherited from [GraphNodeObserver](graphnodeobserver.md).[graphqlHttpProvider](graphnodeobserver.md#optional-graphqlhttpprovider)*

*Defined in [src/graphnode.ts:162](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/graphnode.ts#L162)*

___

### `Optional` graphqlSubscribeToQueries

• **graphqlSubscribeToQueries**? : *undefined | false | true*

*Inherited from [GraphNodeObserver](graphnodeobserver.md).[graphqlSubscribeToQueries](graphnodeobserver.md#optional-graphqlsubscribetoqueries)*

*Defined in [src/graphnode.ts:166](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/graphnode.ts#L166)*

___

### `Optional` graphqlWsProvider

• **graphqlWsProvider**? : *undefined | string*

*Inherited from [GraphNodeObserver](graphnodeobserver.md).[graphqlWsProvider](graphnodeobserver.md#optional-graphqlwsprovider)*

*Defined in [src/graphnode.ts:163](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/graphnode.ts#L163)*

___

###  ipfs

• **ipfs**: *any*

*Defined in [src/arc.ts:35](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L35)*

___

###  ipfsProvider

• **ipfsProvider**: *[IPFSProvider](../globals.md#ipfsprovider)*

*Defined in [src/arc.ts:31](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L31)*

___

###  observedAccounts

• **observedAccounts**: *object*

*Defined in [src/arc.ts:47](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L47)*

#### Type declaration:

* \[ **address**: *string*\]: object

* **lastBalance**? : *undefined | string*

* **observable**? : *Observable‹BN›*

* **observer**? : *Observer‹BN›*

* **subscriptionsCount**: *number*

___

###  pendingOperations

• **pendingOperations**: *Observable‹Array‹[Operation](../globals.md#operation)‹any›››* =  of()

*Defined in [src/arc.ts:33](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L33)*

___

###  web3

• **web3**: *any*

*Defined in [src/arc.ts:36](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L36)*

___

###  web3Provider

• **web3Provider**: *[Web3Provider](../globals.md#web3provider)* = ""

*Defined in [src/arc.ts:29](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L29)*

___

###  web3ProviderRead

• **web3ProviderRead**: *[Web3Provider](../globals.md#web3provider)* = ""

*Defined in [src/arc.ts:30](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L30)*

___

###  web3Read

• **web3Read**: *any*

*Defined in [src/arc.ts:37](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L37)*

## Methods

###  GENToken

▸ **GENToken**(): *[Token](token.md)‹›*

*Defined in [src/arc.ts:369](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L369)*

get the GEN Token

**Returns:** *[Token](token.md)‹›*

a Token instance

___

###  allowance

▸ **allowance**(`owner`: [Address](../globals.md#address), `spender`: [Address](../globals.md#address)): *Observable‹BN›*

*Defined in [src/arc.ts:479](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L479)*

How much GEN spender may spend on behalve of the owner

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`owner` | [Address](../globals.md#address) | Address of the owner of the tokens |
`spender` | [Address](../globals.md#address) | Address of the spender |

**Returns:** *Observable‹BN›*

___

###  approveForStaking

▸ **approveForStaking**(`spender`: [Address](../globals.md#address), `amount`: BN): *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

*Defined in [src/arc.ts:469](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L469)*

**Parameters:**

Name | Type |
------ | ------ |
`spender` | [Address](../globals.md#address) |
`amount` | BN |

**Returns:** *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

___

###  dao

▸ **dao**(`address`: [Address](../globals.md#address)): *[DAO](dao.md)*

*Defined in [src/arc.ts:144](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L144)*

get a DAO instance from an address

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | [Address](../globals.md#address) | address of the dao Avatar |

**Returns:** *[DAO](dao.md)*

an instance of a DAO

___

###  daos

▸ **daos**(`options`: [IDAOQueryOptions](../interfaces/idaoqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[DAO](dao.md)[]›*

*Defined in [src/arc.ts:154](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L154)*

return an observable of the list of DAOs

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`options` | [IDAOQueryOptions](../interfaces/idaoqueryoptions.md) |  {} | options to pass on to the query |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹[DAO](dao.md)[]›*

___

###  ethBalance

▸ **ethBalance**(`owner`: [Address](../globals.md#address)): *Observable‹BN›*

*Defined in [src/arc.ts:205](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L205)*

**Parameters:**

Name | Type |
------ | ------ |
`owner` | [Address](../globals.md#address) |

**Returns:** *Observable‹BN›*

___

###  events

▸ **events**(`options`: [IEventQueryOptions](../interfaces/ieventqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Event](event.md)[]›*

*Defined in [src/arc.ts:184](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L184)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IEventQueryOptions](../interfaces/ieventqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Event](event.md)[]›*

___

###  fetchContractInfos

▸ **fetchContractInfos**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Promise‹[IContractInfo](../interfaces/icontractinfo.md)[]›*

*Defined in [src/arc.ts:122](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L122)*

fetch contractInfos from the subgraph

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Promise‹[IContractInfo](../interfaces/icontractinfo.md)[]›*

a list of IContractInfo instances

___

###  getABI

▸ **getABI**(`address?`: [Address](../globals.md#address), `abiName?`: undefined | string, `version?`: undefined | string): *any*

*Defined in [src/arc.ts:309](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L309)*

**Parameters:**

Name | Type |
------ | ------ |
`address?` | [Address](../globals.md#address) |
`abiName?` | undefined &#124; string |
`version?` | undefined &#124; string |

**Returns:** *any*

___

###  getAccount

▸ **getAccount**(): *Observable‹[Address](../globals.md#address)›*

*Defined in [src/arc.ts:431](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L431)*

**Returns:** *Observable‹[Address](../globals.md#address)›*

___

###  getContract

▸ **getContract**(`address`: [Address](../globals.md#address), `abi?`: any, `mode?`: undefined | "readonly"): *any*

*Defined in [src/arc.ts:341](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L341)*

return a web3 Contract instance.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | [Address](../globals.md#address) | address of the contract to look up in self.contractInfos |
`abi?` | any | - |
`mode?` | undefined &#124; "readonly" | - |

**Returns:** *any*

a web3 contract instance

___

###  getContractInfo

▸ **getContractInfo**(`address`: [Address](../globals.md#address)): *[IContractInfo](../interfaces/icontractinfo.md)*

*Defined in [src/arc.ts:284](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L284)*

return information about the contract

**Parameters:**

Name | Type |
------ | ------ |
`address` | [Address](../globals.md#address) |

**Returns:** *[IContractInfo](../interfaces/icontractinfo.md)*

an IContractInfo instance

___

###  getContractInfoByName

▸ **getContractInfoByName**(`name`: string, `version`: string): *[IContractInfo](../interfaces/icontractinfo.md)*

*Defined in [src/arc.ts:297](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L297)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`version` | string |

**Returns:** *[IContractInfo](../interfaces/icontractinfo.md)*

___

###  getObservable

▸ **getObservable**(`query`: any, `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *any*

*Inherited from [GraphNodeObserver](graphnodeobserver.md).[getObservable](graphnodeobserver.md#getobservable)*

*Defined in [src/graphnode.ts:196](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/graphnode.ts#L196)*

Given a gql query, will return an observable of query results

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`query` | any | - | a gql query object to execute |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | options to pass on to Apollo, cf .. |

**Returns:** *any*

an Observable that will first yield the current result, and yields updates every time the data changes

___

###  getObservableList

▸ **getObservableList**(`query`: any, `itemMap`: function, `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *any*

*Inherited from [GraphNodeObserver](graphnodeobserver.md).[getObservableList](graphnodeobserver.md#getobservablelist)*

*Defined in [src/graphnode.ts:314](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/graphnode.ts#L314)*

Returns an observable that:
- sends a query over http and returns the current list of results
- subscribes over a websocket to changes, and returns the updated list.

**`example:`** 
```
   const query = gql`
   {
     daos {
       id
       address
     }
   }`
   getObservableList(query, (r:any) => new DAO(r.address))
```

**Parameters:**

▪ **query**: *any*

The query to be run

▪`Default value`  **itemMap**: *function*=  (o) => o

(optional) a function that takes elements of the list and creates new objects

▸ (`o`: object): *object | null*

**Parameters:**

Name | Type |
------ | ------ |
`o` | object |

▪`Default value`  **apolloQueryOptions**: *[IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)*=  {}

**Returns:** *any*

an Observable

___

###  getObservableObject

▸ **getObservableObject**(`query`: any, `itemMap`: function, `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *any*

*Inherited from [GraphNodeObserver](graphnodeobserver.md).[getObservableObject](graphnodeobserver.md#getobservableobject)*

*Defined in [src/graphnode.ts:371](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/graphnode.ts#L371)*

Returns an observable that:
- sends a query over http and returns the current list of results
- subscribes over a websocket to changes, and returns the updated list
example:
   const query = gql`
   {
     daos {
       id
       address
     }
   }`
   getObservableList(query, (r:any) => new DAO(r.address), filter((r:any) => r.address === "0x1234..."))

**Parameters:**

▪ **query**: *any*

The query to be run

▪`Default value`  **itemMap**: *function*=  (o) => o

(optional) a function that takes elements of the list and creates new objects

▸ (`o`: object): *object | null*

**Parameters:**

Name | Type |
------ | ------ |
`o` | object |

▪`Default value`  **apolloQueryOptions**: *[IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)*=  {}

**Returns:** *any*

___

###  proposal

▸ **proposal**(`id`: string): *[Proposal](proposal.md)*

*Defined in [src/arc.ts:173](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L173)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *[Proposal](proposal.md)*

___

###  proposals

▸ **proposals**(`options`: [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Proposal](proposal.md)[]›*

*Defined in [src/arc.ts:177](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L177)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Proposal](proposal.md)[]›*

___

###  rewards

▸ **rewards**(`options`: [IRewardQueryOptions](../interfaces/irewardqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Reward](reward.md)[]›*

*Defined in [src/arc.ts:191](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L191)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IRewardQueryOptions](../interfaces/irewardqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Reward](reward.md)[]›*

___

###  saveIPFSData

▸ **saveIPFSData**(`options`: object): *Promise‹string›*

*Defined in [src/arc.ts:503](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L503)*

save data of a proposal to IPFS, return  the IPFS hash

**Parameters:**

▪ **options**: *object*

an Object to save. This object must have title, url and desction defined

Name | Type |
------ | ------ |
`description?` | undefined &#124; string |
`tags?` | string[] |
`title?` | undefined &#124; string |
`url?` | undefined &#124; string |

**Returns:** *Promise‹string›*

a Promise that resolves in the IPFS Hash where the file is saved

___

###  scheme

▸ **scheme**(`id`: string): *[Scheme](scheme.md)*

*Defined in [src/arc.ts:162](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L162)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |

**Returns:** *[Scheme](scheme.md)*

___

###  schemes

▸ **schemes**(`options`: [ISchemeQueryOptions](../interfaces/ischemequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Scheme](scheme.md)[]›*

*Defined in [src/arc.ts:166](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L166)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [ISchemeQueryOptions](../interfaces/ischemequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Scheme](scheme.md)[]›*

___

###  sendQuery

▸ **sendQuery**(`query`: any, `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Promise‹object›*

*Inherited from [GraphNodeObserver](graphnodeobserver.md).[sendQuery](graphnodeobserver.md#sendquery)*

*Defined in [src/graphnode.ts:391](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/graphnode.ts#L391)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`query` | any | - |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Promise‹object›*

___

###  sendTransaction

▸ **sendTransaction**‹**T**›(`transaction`: any, `mapToObject`: function, `errorHandler?`: [transactionErrorHandler](../globals.md#transactionerrorhandler)): *[Operation](../globals.md#operation)‹T›*

*Defined in [src/arc.ts:490](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L490)*

send an Ethereum transaction

**Type parameters:**

▪ **T**

**Parameters:**

▪ **transaction**: *any*

▪ **mapToObject**: *function*

▸ (`receipt`: [web3receipt](../globals.md#web3receipt)): *T*

**Parameters:**

Name | Type |
------ | ------ |
`receipt` | [web3receipt](../globals.md#web3receipt) |

▪`Optional`  **errorHandler**: *[transactionErrorHandler](../globals.md#transactionerrorhandler)*

**Returns:** *[Operation](../globals.md#operation)‹T›*

An observable of

___

###  setAccount

▸ **setAccount**(`address`: [Address](../globals.md#address)): *void*

*Defined in [src/arc.ts:465](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L465)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | [Address](../globals.md#address) |

**Returns:** *void*

___

###  setContractInfos

▸ **setContractInfos**(`contractInfos`: [IContractInfo](../interfaces/icontractinfo.md)[]): *Promise‹void›*

*Defined in [src/arc.ts:111](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L111)*

set the contract addresses

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`contractInfos` | [IContractInfo](../interfaces/icontractinfo.md)[] | a list of IContractInfo objects |

**Returns:** *Promise‹void›*

___

###  stakes

▸ **stakes**(`options`: [IStakeQueryOptions](../interfaces/istakequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Stake](stake.md)[]›*

*Defined in [src/arc.ts:198](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L198)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IStakeQueryOptions](../interfaces/istakequeryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Stake](stake.md)[]›*

___

###  tags

▸ **tags**(`options`: [ITagQueryOptions](../interfaces/itagqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Tag](tag.md)[]›*

*Defined in [src/arc.ts:158](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L158)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [ITagQueryOptions](../interfaces/itagqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Tag](tag.md)[]›*

___

### `Private` validateGenesisProtocolParams

▸ **validateGenesisProtocolParams**(`gpAddress`: [Address](../globals.md#address), `parametersHash`: string): *Promise‹boolean›*

*Defined in [src/arc.ts:530](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L530)*

**Parameters:**

Name | Type |
------ | ------ |
`gpAddress` | [Address](../globals.md#address) |
`parametersHash` | string |

**Returns:** *Promise‹boolean›*

___

###  verifyParametersHash

▸ **verifyParametersHash**(`address`: [Address](../globals.md#address), `schemeParametersHash`: string, `schemeName?`: undefined | string): *Promise‹boolean›*

*Defined in [src/arc.ts:394](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/arc.ts#L394)*

verify scheme parametersHash

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | [Address](../globals.md#address) | address of the scheme to verify its params hash |
`schemeParametersHash` | string | the scheme params hash |
`schemeName?` | undefined &#124; string | optional |

**Returns:** *Promise‹boolean›*

true if :
  scheme is not one of the following:
   'SchemeRegistrar','ContributionReward','GenericScheme','GenericSchemeMultiCall'
  or
   parameters are verified for this scheme,
 otherwise - will return false
