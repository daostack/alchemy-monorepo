[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [Reputation](reputation.md)

# Class: Reputation

## Hierarchy

* **Reputation**

## Implements

* [IStateful](../interfaces/istateful.md)‹[IReputationState](../interfaces/ireputationstate.md)›

## Index

### Constructors

* [constructor](reputation.md#constructor)

### Properties

* [address](reputation.md#address)
* [context](reputation.md#context)
* [id](reputation.md#id)

### Methods

* [contract](reputation.md#contract)
* [mint](reputation.md#mint)
* [reputationOf](reputation.md#reputationof)
* [state](reputation.md#state)
* [search](reputation.md#static-search)

## Constructors

###  constructor

\+ **new Reputation**(`id`: [Address](../globals.md#address), `context`: [Arc](arc.md)): *[Reputation](reputation.md)*

*Defined in [src/reputation.ts:67](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/reputation.ts#L67)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | [Address](../globals.md#address) |
`context` | [Arc](arc.md) |

**Returns:** *[Reputation](reputation.md)*

## Properties

###  address

• **address**: *[Address](../globals.md#address)*

*Defined in [src/reputation.ts:67](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/reputation.ts#L67)*

___

###  context

• **context**: *[Arc](arc.md)*

*Defined in [src/reputation.ts:68](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/reputation.ts#L68)*

___

###  id

• **id**: *[Address](../globals.md#address)*

*Defined in [src/reputation.ts:68](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/reputation.ts#L68)*

## Methods

###  contract

▸ **contract**(): *any*

*Defined in [src/reputation.ts:120](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/reputation.ts#L120)*

**Returns:** *any*

___

###  mint

▸ **mint**(`beneficiary`: [Address](../globals.md#address), `amount`: BN): *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

*Defined in [src/reputation.ts:125](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/reputation.ts#L125)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiary` | [Address](../globals.md#address) |
`amount` | BN |

**Returns:** *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

___

###  reputationOf

▸ **reputationOf**(`address`: [Address](../globals.md#address)): *Observable‹BN›*

*Defined in [src/reputation.ts:96](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/reputation.ts#L96)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | [Address](../globals.md#address) |

**Returns:** *Observable‹BN›*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[IReputationState](../interfaces/ireputationstate.md)›*

*Defined in [src/reputation.ts:72](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/reputation.ts#L72)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[IReputationState](../interfaces/ireputationstate.md)›*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [IReputationQueryOptions](../interfaces/ireputationqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Reputation](reputation.md)[]›*

*Defined in [src/reputation.ts:31](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/reputation.ts#L31)*

Reputation.search(context, options) searches for reputation entities

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | an Arc instance that provides connection information |
`options` | [IReputationQueryOptions](../interfaces/ireputationqueryoptions.md) |  {} | the query options, cf. IReputationQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹[Reputation](reputation.md)[]›*

an observable of Reputation objects
