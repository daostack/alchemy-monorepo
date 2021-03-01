[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [Vote](vote.md)

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

### Object literals

* [fragments](vote.md#static-fragments)

## Constructors

###  constructor

\+ **new Vote**(`idOrOpts`: string | [IVoteStaticState](../interfaces/ivotestaticstate.md), `context`: [Arc](arc.md)): *[Vote](vote.md)*

*Defined in [src/vote.ts:157](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/vote.ts#L157)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | string &#124; [IVoteStaticState](../interfaces/ivotestaticstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[Vote](vote.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [src/vote.ts:159](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/vote.ts#L159)*

___

###  id

• **id**: *string | undefined*

*Defined in [src/vote.ts:156](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/vote.ts#L156)*

___

###  staticState

• **staticState**: *[IVoteStaticState](../interfaces/ivotestaticstate.md) | undefined*

*Defined in [src/vote.ts:157](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/vote.ts#L157)*

## Methods

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[IVoteStaticState](../interfaces/ivotestaticstate.md)›*

*Defined in [src/vote.ts:199](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/vote.ts#L199)*

**Returns:** *Promise‹[IVoteStaticState](../interfaces/ivotestaticstate.md)›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [IVoteStaticState](../interfaces/ivotestaticstate.md)): *void*

*Defined in [src/vote.ts:195](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/vote.ts#L195)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [IVoteStaticState](../interfaces/ivotestaticstate.md) |

**Returns:** *void*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[IVoteState](../interfaces/ivotestate.md)›*

*Defined in [src/vote.ts:169](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/vote.ts#L169)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[IVoteState](../interfaces/ivotestate.md)›*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [IVoteQueryOptions](../interfaces/ivotequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Vote](vote.md)[]›*

*Defined in [src/vote.ts:58](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/vote.ts#L58)*

Vote.search(context, options) searches for vote entities

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | an Arc instance that provides connection information |
`options` | [IVoteQueryOptions](../interfaces/ivotequeryoptions.md) |  {} | the query options, cf. IVoteQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹[Vote](vote.md)[]›*

an observable of Vote objects

## Object literals

### `Static` fragments

### ▪ **fragments**: *object*

*Defined in [src/vote.ts:36](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/vote.ts#L36)*

###  VoteFields

• **VoteFields**: *DocumentNode* =  gql`fragment VoteFields on ProposalVote {
      id
      createdAt
      dao {
        id
      }
      voter
      proposal {
        id
      }
      outcome
      reputation
    }`

*Defined in [src/vote.ts:37](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/vote.ts#L37)*
