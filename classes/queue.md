[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [Queue](queue.md)

# Class: Queue

## Hierarchy

* **Queue**

## Implements

* [IStateful](../interfaces/istateful.md)‹[IQueueState](../interfaces/iqueuestate.md)›

## Index

### Constructors

* [constructor](queue.md#constructor)

### Properties

* [context](queue.md#context)
* [dao](queue.md#dao)
* [id](queue.md#id)

### Methods

* [state](queue.md#state)
* [search](queue.md#static-search)

## Constructors

###  constructor

\+ **new Queue**(`id`: string, `dao`: [DAO](dao.md), `context`: [Arc](arc.md)): *[Queue](queue.md)*

*Defined in [src/queue.ts:90](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/queue.ts#L90)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`dao` | [DAO](dao.md) |
`context` | [Arc](arc.md) |

**Returns:** *[Queue](queue.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [src/queue.ts:95](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/queue.ts#L95)*

___

###  dao

• **dao**: *[DAO](dao.md)*

*Defined in [src/queue.ts:94](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/queue.ts#L94)*

___

###  id

• **id**: *string*

*Defined in [src/queue.ts:93](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/queue.ts#L93)*

## Methods

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[IQueueState](../interfaces/iqueuestate.md)›*

*Defined in [src/queue.ts:100](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/queue.ts#L100)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[IQueueState](../interfaces/iqueuestate.md)›*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [IQueueQueryOptions](../interfaces/iqueuequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Queue](queue.md)[]›*

*Defined in [src/queue.ts:39](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/queue.ts#L39)*

Queue.search(context, options) searches for queue entities

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | an Arc instance that provides connection information |
`options` | [IQueueQueryOptions](../interfaces/iqueuequeryoptions.md) |  {} | the query options, cf. IQueueQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹[Queue](queue.md)[]›*

an observable of Queue objects
