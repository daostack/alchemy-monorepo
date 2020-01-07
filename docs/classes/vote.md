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

### Object literals

* [fragments](vote.md#static-fragments)

## Constructors

###  constructor

\+ **new Vote**(`idOrOpts`: string | [IVoteStaticState](../interfaces/ivotestaticstate.md), `context`: [Arc](arc.md)): *[Vote](vote.md)*

*Defined in [vote.ts:155](https://github.com/daostack/client/blob/aa9723f/src/vote.ts#L155)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | string &#124; [IVoteStaticState](../interfaces/ivotestaticstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[Vote](vote.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [vote.ts:157](https://github.com/daostack/client/blob/aa9723f/src/vote.ts#L157)*

___

###  id

• **id**: *string | undefined*

*Defined in [vote.ts:154](https://github.com/daostack/client/blob/aa9723f/src/vote.ts#L154)*

___

###  staticState

• **staticState**: *[IVoteStaticState](../interfaces/ivotestaticstate.md) | undefined*

*Defined in [vote.ts:155](https://github.com/daostack/client/blob/aa9723f/src/vote.ts#L155)*

## Methods

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[IVoteStaticState](../interfaces/ivotestaticstate.md)›*

*Defined in [vote.ts:197](https://github.com/daostack/client/blob/aa9723f/src/vote.ts#L197)*

**Returns:** *Promise‹[IVoteStaticState](../interfaces/ivotestaticstate.md)›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [IVoteStaticState](../interfaces/ivotestaticstate.md)): *void*

*Defined in [vote.ts:193](https://github.com/daostack/client/blob/aa9723f/src/vote.ts#L193)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [IVoteStaticState](../interfaces/ivotestaticstate.md) |

**Returns:** *void*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[IVoteState](../interfaces/ivotestate.md)›*

*Defined in [vote.ts:167](https://github.com/daostack/client/blob/aa9723f/src/vote.ts#L167)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[IVoteState](../interfaces/ivotestate.md)›*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [IVoteQueryOptions](../interfaces/ivotequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Vote](vote.md)[]›*

*Defined in [vote.ts:58](https://github.com/daostack/client/blob/aa9723f/src/vote.ts#L58)*

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

*Defined in [vote.ts:36](https://github.com/daostack/client/blob/aa9723f/src/vote.ts#L36)*

###  VoteFields

• **VoteFields**: *any* =  gql`fragment VoteFields on ProposalVote {
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

*Defined in [vote.ts:37](https://github.com/daostack/client/blob/aa9723f/src/vote.ts#L37)*
