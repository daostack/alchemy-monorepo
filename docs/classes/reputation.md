[@daostack/client](../README.md) › [Globals](../globals.md) › [Reputation](reputation.md)

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

*Defined in [reputation.ts:66](https://github.com/daostack/client/blob/c62f433/src/reputation.ts#L66)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | [Address](../globals.md#address) |
`context` | [Arc](arc.md) |

**Returns:** *[Reputation](reputation.md)*

## Properties

###  address

• **address**: *[Address](../globals.md#address)*

*Defined in [reputation.ts:66](https://github.com/daostack/client/blob/c62f433/src/reputation.ts#L66)*

___

###  context

• **context**: *[Arc](arc.md)*

*Defined in [reputation.ts:67](https://github.com/daostack/client/blob/c62f433/src/reputation.ts#L67)*

___

###  id

• **id**: *[Address](../globals.md#address)*

*Defined in [reputation.ts:67](https://github.com/daostack/client/blob/c62f433/src/reputation.ts#L67)*

## Methods

###  contract

▸ **contract**(): *any*

*Defined in [reputation.ts:119](https://github.com/daostack/client/blob/c62f433/src/reputation.ts#L119)*

**Returns:** *any*

___

###  mint

▸ **mint**(`beneficiary`: [Address](../globals.md#address), `amount`: any): *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

*Defined in [reputation.ts:124](https://github.com/daostack/client/blob/c62f433/src/reputation.ts#L124)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiary` | [Address](../globals.md#address) |
`amount` | any |

**Returns:** *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

___

###  reputationOf

▸ **reputationOf**(`address`: [Address](../globals.md#address)): *Observable‹any›*

*Defined in [reputation.ts:95](https://github.com/daostack/client/blob/c62f433/src/reputation.ts#L95)*

**Parameters:**

Name | Type |
------ | ------ |
`address` | [Address](../globals.md#address) |

**Returns:** *Observable‹any›*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[IReputationState](../interfaces/ireputationstate.md)›*

*Defined in [reputation.ts:71](https://github.com/daostack/client/blob/c62f433/src/reputation.ts#L71)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[IReputationState](../interfaces/ireputationstate.md)›*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [IReputationQueryOptions](../interfaces/ireputationqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Reputation](reputation.md)[]›*

*Defined in [reputation.ts:30](https://github.com/daostack/client/blob/c62f433/src/reputation.ts#L30)*

Reputation.search(context, options) searches for reputation entities

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | an Arc instance that provides connection information |
`options` | [IReputationQueryOptions](../interfaces/ireputationqueryoptions.md) |  {} | the query options, cf. IReputationQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹[Reputation](reputation.md)[]›*

an observable of Reputation objects
