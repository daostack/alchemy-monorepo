[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [Token](token.md)

# Class: Token

## Hierarchy

* **Token**

## Implements

* [IStateful](../interfaces/istateful.md)‹[ITokenState](../interfaces/itokenstate.md)›

## Index

### Constructors

* [constructor](token.md#constructor)

### Properties

* [address](token.md#address)
* [context](token.md#context)
* [id](token.md#id)

### Methods

* [allowance](token.md#allowance)
* [approveForStaking](token.md#approveforstaking)
* [balanceOf](token.md#balanceof)
* [contract](token.md#contract)
* [mint](token.md#mint)
* [state](token.md#state)
* [transfer](token.md#transfer)
* [search](token.md#static-search)

## Constructors

###  constructor

\+ **new Token**(`id`: [Address](../globals.md#address), `context`: [Arc](arc.md)): *[Token](token.md)*

*Defined in [src/token.ts:87](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/token.ts#L87)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | [Address](../globals.md#address) |
`context` | [Arc](arc.md) |

**Returns:** *[Token](token.md)*

## Properties

###  address

• **address**: *string*

*Defined in [src/token.ts:87](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/token.ts#L87)*

___

###  context

• **context**: *[Arc](arc.md)*

*Defined in [src/token.ts:89](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/token.ts#L89)*

___

###  id

• **id**: *[Address](../globals.md#address)*

*Defined in [src/token.ts:89](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/token.ts#L89)*

## Methods

###  allowance

▸ **allowance**(`owner`: [Address](../globals.md#address), `spender`: [Address](../globals.md#address)): *Observable‹BN›*

*Defined in [src/token.ts:185](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/token.ts#L185)*

**Parameters:**

Name | Type |
------ | ------ |
`owner` | [Address](../globals.md#address) |
`spender` | [Address](../globals.md#address) |

**Returns:** *Observable‹BN›*

___

###  approveForStaking

▸ **approveForStaking**(`spender`: [Address](../globals.md#address), `amount`: BN): *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

*Defined in [src/token.ts:226](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/token.ts#L226)*

**Parameters:**

Name | Type |
------ | ------ |
`spender` | [Address](../globals.md#address) |
`amount` | BN |

**Returns:** *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

___

###  balanceOf

▸ **balanceOf**(`owner`: string): *Observable‹BN›*

*Defined in [src/token.ts:133](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/token.ts#L133)*

**Parameters:**

Name | Type |
------ | ------ |
`owner` | string |

**Returns:** *Observable‹BN›*

___

###  contract

▸ **contract**(`mode?`: undefined | "readonly"): *any*

*Defined in [src/token.ts:128](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/token.ts#L128)*

**Parameters:**

Name | Type |
------ | ------ |
`mode?` | undefined &#124; "readonly" |

**Returns:** *any*

___

###  mint

▸ **mint**(`beneficiary`: [Address](../globals.md#address), `amount`: BN): *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

*Defined in [src/token.ts:212](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/token.ts#L212)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiary` | [Address](../globals.md#address) |
`amount` | BN |

**Returns:** *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[ITokenState](../interfaces/itokenstate.md)›*

*Defined in [src/token.ts:97](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/token.ts#L97)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[ITokenState](../interfaces/itokenstate.md)›*

___

###  transfer

▸ **transfer**(`beneficiary`: [Address](../globals.md#address), `amount`: BN): *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

*Defined in [src/token.ts:219](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/token.ts#L219)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiary` | [Address](../globals.md#address) |
`amount` | BN |

**Returns:** *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [ITokenQueryOptions](../interfaces/itokenqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Token](token.md)[]›*

*Defined in [src/token.ts:52](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/token.ts#L52)*

Token.search(context, options) searches for token entities

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | an Arc instance that provides connection information |
`options` | [ITokenQueryOptions](../interfaces/itokenqueryoptions.md) |  {} | the query options, cf. ITokenQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹[Token](token.md)[]›*

an observable of Token objects
