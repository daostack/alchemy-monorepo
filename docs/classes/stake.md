[@daostack/client](../README.md) › [Globals](../globals.md) › [Stake](stake.md)

# Class: Stake

## Hierarchy

* **Stake**

## Implements

* [IStateful](../interfaces/istateful.md)‹[IStakeState](../interfaces/istakestate.md)›

## Index

### Constructors

* [constructor](stake.md#constructor)

### Properties

* [context](stake.md#context)
* [id](stake.md#id)
* [staticState](stake.md#staticstate)

### Methods

* [fetchStaticState](stake.md#fetchstaticstate)
* [setStaticState](stake.md#setstaticstate)
* [state](stake.md#state)
* [search](stake.md#static-search)

## Constructors

###  constructor

\+ **new Stake**(`idOrOpts`: string | [IStakeStaticState](../interfaces/istakestaticstate.md), `context`: [Arc](arc.md)): *[Stake](stake.md)*

*Defined in [stake.ts:102](https://github.com/daostack/client/blob/3edf873/src/stake.ts#L102)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | string &#124; [IStakeStaticState](../interfaces/istakestaticstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[Stake](stake.md)*

## Properties

###  context

• **context**: *[Arc](arc.md)*

*Defined in [stake.ts:106](https://github.com/daostack/client/blob/3edf873/src/stake.ts#L106)*

___

###  id

• **id**: *string | undefined*

*Defined in [stake.ts:101](https://github.com/daostack/client/blob/3edf873/src/stake.ts#L101)*

___

###  staticState

• **staticState**: *[IStakeStaticState](../interfaces/istakestaticstate.md) | undefined*

*Defined in [stake.ts:102](https://github.com/daostack/client/blob/3edf873/src/stake.ts#L102)*

## Methods

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[IStakeStaticState](../interfaces/istakestaticstate.md)›*

*Defined in [stake.ts:152](https://github.com/daostack/client/blob/3edf873/src/stake.ts#L152)*

**Returns:** *Promise‹[IStakeStaticState](../interfaces/istakestaticstate.md)›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [IStakeStaticState](../interfaces/istakestaticstate.md)): *void*

*Defined in [stake.ts:148](https://github.com/daostack/client/blob/3edf873/src/stake.ts#L148)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [IStakeStaticState](../interfaces/istakestaticstate.md) |

**Returns:** *void*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[IStakeState](../interfaces/istakestate.md)›*

*Defined in [stake.ts:116](https://github.com/daostack/client/blob/3edf873/src/stake.ts#L116)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[IStakeState](../interfaces/istakestate.md)›*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [IStakeQueryOptions](../interfaces/istakequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Stake](stake.md)[]›*

*Defined in [stake.ts:41](https://github.com/daostack/client/blob/3edf873/src/stake.ts#L41)*

Stake.search(context, options) searches for stake entities

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | an Arc instance that provides connection information |
`options` | [IStakeQueryOptions](../interfaces/istakequeryoptions.md) |  {} | the query options, cf. IStakeQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹[Stake](stake.md)[]›*

an observable of Stake objects
