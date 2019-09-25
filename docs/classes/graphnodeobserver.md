[@daostack/client](../README.md) › [Globals](../globals.md) › [GraphNodeObserver](graphnodeobserver.md)

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
* [getObservableListWithFilter](graphnodeobserver.md#getobservablelistwithfilter)
* [getObservableObject](graphnodeobserver.md#getobservableobject)
* [sendQuery](graphnodeobserver.md#sendquery)

## Constructors

###  constructor

\+ **new GraphNodeObserver**(`options`: object): *[GraphNodeObserver](graphnodeobserver.md)*

*Defined in [graphnode.ts:103](https://github.com/daostack/client/blob/a73e635/src/graphnode.ts#L103)*

**Parameters:**

▪ **options**: *object*

Name | Type |
------ | ------ |
`graphqlHttpProvider?` | undefined &#124; string |
`graphqlSubscribeToQueries?` | undefined &#124; false &#124; true |
`graphqlWsProvider?` | undefined &#124; string |

**Returns:** *[GraphNodeObserver](graphnodeobserver.md)*

## Properties

###  Logger

• **Logger**: *GlobalLogger* =  Logger

*Defined in [graphnode.ts:101](https://github.com/daostack/client/blob/a73e635/src/graphnode.ts#L101)*

___

### `Optional` apolloClient

• **apolloClient**? : *ApolloClient‹object›*

*Defined in [graphnode.ts:102](https://github.com/daostack/client/blob/a73e635/src/graphnode.ts#L102)*

___

### `Optional` graphqlHttpProvider

• **graphqlHttpProvider**? : *undefined | string*

*Defined in [graphnode.ts:99](https://github.com/daostack/client/blob/a73e635/src/graphnode.ts#L99)*

___

### `Optional` graphqlSubscribeToQueries

• **graphqlSubscribeToQueries**? : *undefined | false | true*

*Defined in [graphnode.ts:103](https://github.com/daostack/client/blob/a73e635/src/graphnode.ts#L103)*

___

### `Optional` graphqlWsProvider

• **graphqlWsProvider**? : *undefined | string*

*Defined in [graphnode.ts:100](https://github.com/daostack/client/blob/a73e635/src/graphnode.ts#L100)*

## Methods

###  getObservable

▸ **getObservable**(`query`: any, `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *any*

*Defined in [graphnode.ts:129](https://github.com/daostack/client/blob/a73e635/src/graphnode.ts#L129)*

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

*Defined in [graphnode.ts:231](https://github.com/daostack/client/blob/a73e635/src/graphnode.ts#L231)*

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

###  getObservableListWithFilter

▸ **getObservableListWithFilter**(`query`: any, `itemMap`: function, `filterFunc`: function, `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *any*

*Defined in [graphnode.ts:270](https://github.com/daostack/client/blob/a73e635/src/graphnode.ts#L270)*

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

▪ **filterFunc**: *function*

▸ (`o`: object): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`o` | object |

▪`Default value`  **apolloQueryOptions**: *[IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)*=  {}

**Returns:** *any*

___

###  getObservableObject

▸ **getObservableObject**(`query`: any, `itemMap`: function, `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *any*

*Defined in [graphnode.ts:287](https://github.com/daostack/client/blob/a73e635/src/graphnode.ts#L287)*

**Parameters:**

▪ **query**: *any*

▪`Default value`  **itemMap**: *function*=  (o) => o

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

*Defined in [graphnode.ts:307](https://github.com/daostack/client/blob/a73e635/src/graphnode.ts#L307)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`query` | any | - |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Promise‹object›*
