[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [GraphNodeObserver](graphnodeobserver.md)

# Class: GraphNodeObserver

handles connections with the Graph

**`param`** 

## Hierarchy

* **GraphNodeObserver**

  ↳ [Arc](arc.md)

## Index

### Constructors

* [constructor](graphnodeobserver.md#constructor)

### Properties

* [Logger](graphnodeobserver.md#logger)
* [apolloClient](graphnodeobserver.md#optional-apolloclient)
* [graphqlHttpProvider](graphnodeobserver.md#optional-graphqlhttpprovider)
* [graphqlSubscribeToQueries](graphnodeobserver.md#optional-graphqlsubscribetoqueries)
* [graphqlWsProvider](graphnodeobserver.md#optional-graphqlwsprovider)

### Methods

* [getObservable](graphnodeobserver.md#getobservable)
* [getObservableList](graphnodeobserver.md#getobservablelist)
* [getObservableObject](graphnodeobserver.md#getobservableobject)
* [sendQuery](graphnodeobserver.md#sendquery)

## Constructors

###  constructor

\+ **new GraphNodeObserver**(`options`: object): *[GraphNodeObserver](graphnodeobserver.md)*

*Defined in [src/graphnode.ts:166](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/graphnode.ts#L166)*

**Parameters:**

▪ **options**: *object*

Name | Type |
------ | ------ |
`errHandler?` | any |
`graphqlHttpProvider?` | undefined &#124; string |
`graphqlSubscribeToQueries?` | undefined &#124; false &#124; true |
`graphqlWsProvider?` | undefined &#124; string |
`prefetchHook?` | any |
`retryLink?` | any |

**Returns:** *[GraphNodeObserver](graphnodeobserver.md)*

## Properties

###  Logger

• **Logger**: *GlobalLogger* =  Logger

*Defined in [src/graphnode.ts:164](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/graphnode.ts#L164)*

___

### `Optional` apolloClient

• **apolloClient**? : *ApolloClient‹object›*

*Defined in [src/graphnode.ts:165](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/graphnode.ts#L165)*

___

### `Optional` graphqlHttpProvider

• **graphqlHttpProvider**? : *undefined | string*

*Defined in [src/graphnode.ts:162](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/graphnode.ts#L162)*

___

### `Optional` graphqlSubscribeToQueries

• **graphqlSubscribeToQueries**? : *undefined | false | true*

*Defined in [src/graphnode.ts:166](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/graphnode.ts#L166)*

___

### `Optional` graphqlWsProvider

• **graphqlWsProvider**? : *undefined | string*

*Defined in [src/graphnode.ts:163](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/graphnode.ts#L163)*

## Methods

###  getObservable

▸ **getObservable**(`query`: any, `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *any*

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

###  sendQuery

▸ **sendQuery**(`query`: any, `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Promise‹object›*

*Defined in [src/graphnode.ts:391](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/graphnode.ts#L391)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`query` | any | - |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Promise‹object›*
