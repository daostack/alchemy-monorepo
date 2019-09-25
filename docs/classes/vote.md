[@daostack/client](../README.md) › [Globals](../globals.md) › [Vote](vote.md)

# Class: Vote

## Hierarchy

* **Vote**

## Implements

* [IStateful](../interfaces/istateful.md)‹[IVoteState](../interfaces/ivotestate.md)›

## Index

### Constructors

* [constructor](vote.md#constructor)

### Properties

* [context](vote.md#context)
* [id](vote.md#id)
* [staticState](vote.md#staticstate)

### Methods

* [fetchStaticState](vote.md#fetchstaticstate)
* [setStaticState](vote.md#setstaticstate)
* [state](vote.md#state)
* [search](vote.md#static-search)

## Constructors

###  constructor

\+ **new Vote**(`idOrOpts`: string | [IVoteStaticState](../interfaces/ivotestaticstate.md), `context`: [Arc](arc.md)): *[Vote](vote.md)*

*Defined in [vote.ts:113](https://github.com/daostack/client/blob/a73e635/src/vote.ts#L113)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | string &#124; [IVoteStaticState](../interfaces/ivotestaticstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[Vote](vote.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [vote.ts:115](https://github.com/daostack/client/blob/a73e635/src/vote.ts#L115)*

___

###  id

• **id**: *string | undefined*

*Defined in [vote.ts:112](https://github.com/daostack/client/blob/a73e635/src/vote.ts#L112)*

___

###  staticState

• **staticState**: *[IVoteStaticState](../interfaces/ivotestaticstate.md) | undefined*

*Defined in [vote.ts:113](https://github.com/daostack/client/blob/a73e635/src/vote.ts#L113)*

## Methods

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[IVoteStaticState](../interfaces/ivotestaticstate.md)›*

*Defined in [vote.ts:163](https://github.com/daostack/client/blob/a73e635/src/vote.ts#L163)*

**Returns:** *Promise‹[IVoteStaticState](../interfaces/ivotestaticstate.md)›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [IVoteStaticState](../interfaces/ivotestaticstate.md)): *void*

*Defined in [vote.ts:159](https://github.com/daostack/client/blob/a73e635/src/vote.ts#L159)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [IVoteStaticState](../interfaces/ivotestaticstate.md) |

**Returns:** *void*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[IVoteState](../interfaces/ivotestate.md)›*

*Defined in [vote.ts:125](https://github.com/daostack/client/blob/a73e635/src/vote.ts#L125)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[IVoteState](../interfaces/ivotestate.md)›*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [IVoteQueryOptions](../interfaces/ivotequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Vote](vote.md)[]›*

*Defined in [vote.ts:42](https://github.com/daostack/client/blob/a73e635/src/vote.ts#L42)*

Vote.search(context, options) searches for vote entities

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | an Arc instance that provides connection information |
`options` | [IVoteQueryOptions](../interfaces/ivotequeryoptions.md) |  {} | the query options, cf. IVoteQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹[Vote](vote.md)[]›*

an observable of Vote objects
