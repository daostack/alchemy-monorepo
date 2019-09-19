[@daostack/client](../README.md) › [Globals](../globals.md) › [Reward](reward.md)

# Class: Reward

## Hierarchy

* **Reward**

## Implements

* [IStateful](../interfaces/istateful.md)‹[IRewardState](../interfaces/irewardstate.md)›

## Index

### Constructors

* [constructor](reward.md#constructor)

### Properties

* [context](reward.md#context)
* [id](reward.md#id)

### Methods

* [state](reward.md#state)
* [search](reward.md#static-search)

## Constructors

###  constructor

\+ **new Reward**(`id`: string, `context`: [Arc](arc.md)): *[Reward](reward.md)*

*Defined in [reward.ts:76](https://github.com/daostack/client/blob/3edf873/src/reward.ts#L76)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | string |
`context` | [Arc](arc.md) |

**Returns:** *[Reward](reward.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [reward.ts:78](https://github.com/daostack/client/blob/3edf873/src/reward.ts#L78)*

___

###  id

• **id**: *string*

*Defined in [reward.ts:78](https://github.com/daostack/client/blob/3edf873/src/reward.ts#L78)*

## Methods

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[IRewardState](../interfaces/irewardstate.md)›*

*Defined in [reward.ts:83](https://github.com/daostack/client/blob/3edf873/src/reward.ts#L83)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[IRewardState](../interfaces/irewardstate.md)›*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [IRewardQueryOptions](../interfaces/irewardqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Reward](reward.md)[]›*

*Defined in [reward.ts:44](https://github.com/daostack/client/blob/3edf873/src/reward.ts#L44)*

Reward.search(context, options) searches for reward entities

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | an Arc instance that provides connection information |
`options` | [IRewardQueryOptions](../interfaces/irewardqueryoptions.md) |  {} | the query options, cf. IRewardQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹[Reward](reward.md)[]›*

an observable of Reward objects
