[@daostack/client](../README.md) › [Globals](../globals.md) › [Token](token.md)

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

*Defined in [token.ts:87](https://github.com/daostack/client/blob/c62f433/src/token.ts#L87)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | [Address](../globals.md#address) |
`context` | [Arc](arc.md) |

**Returns:** *[Token](token.md)*

## Properties

###  address

• **address**: *string*

*Defined in [token.ts:87](https://github.com/daostack/client/blob/c62f433/src/token.ts#L87)*

___

###  context

• **context**: *[Arc](arc.md)*

*Defined in [token.ts:89](https://github.com/daostack/client/blob/c62f433/src/token.ts#L89)*

___

###  id

• **id**: *[Address](../globals.md#address)*

*Defined in [token.ts:89](https://github.com/daostack/client/blob/c62f433/src/token.ts#L89)*

## Methods

###  allowance

▸ **allowance**(`owner`: [Address](../globals.md#address), `spender`: [Address](../globals.md#address)): *Observable‹any›*

*Defined in [token.ts:180](https://github.com/daostack/client/blob/c62f433/src/token.ts#L180)*

**Parameters:**

Name | Type |
------ | ------ |
`owner` | [Address](../globals.md#address) |
`spender` | [Address](../globals.md#address) |

**Returns:** *Observable‹any›*

___

###  approveForStaking

▸ **approveForStaking**(`spender`: [Address](../globals.md#address), `amount`: any): *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

*Defined in [token.ts:221](https://github.com/daostack/client/blob/c62f433/src/token.ts#L221)*

**Parameters:**

Name | Type |
------ | ------ |
`spender` | [Address](../globals.md#address) |
`amount` | any |

**Returns:** *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

___

###  balanceOf

▸ **balanceOf**(`owner`: string): *Observable‹any›*

*Defined in [token.ts:133](https://github.com/daostack/client/blob/c62f433/src/token.ts#L133)*

**Parameters:**

Name | Type |
------ | ------ |
`owner` | string |

**Returns:** *Observable‹any›*

___

###  contract

▸ **contract**(`mode?`: undefined | "readonly"): *any*

*Defined in [token.ts:128](https://github.com/daostack/client/blob/c62f433/src/token.ts#L128)*

**Parameters:**

Name | Type |
------ | ------ |
`mode?` | undefined &#124; "readonly" |

**Returns:** *any*

___

###  mint

▸ **mint**(`beneficiary`: [Address](../globals.md#address), `amount`: any): *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

*Defined in [token.ts:207](https://github.com/daostack/client/blob/c62f433/src/token.ts#L207)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiary` | [Address](../globals.md#address) |
`amount` | any |

**Returns:** *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[ITokenState](../interfaces/itokenstate.md)›*

*Defined in [token.ts:97](https://github.com/daostack/client/blob/c62f433/src/token.ts#L97)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[ITokenState](../interfaces/itokenstate.md)›*

___

###  transfer

▸ **transfer**(`beneficiary`: [Address](../globals.md#address), `amount`: any): *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

*Defined in [token.ts:214](https://github.com/daostack/client/blob/c62f433/src/token.ts#L214)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiary` | [Address](../globals.md#address) |
`amount` | any |

**Returns:** *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [ITokenQueryOptions](../interfaces/itokenqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Token](token.md)[]›*

*Defined in [token.ts:52](https://github.com/daostack/client/blob/c62f433/src/token.ts#L52)*

Token.search(context, options) searches for token entities

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | an Arc instance that provides connection information |
`options` | [ITokenQueryOptions](../interfaces/itokenqueryoptions.md) |  {} | the query options, cf. ITokenQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹[Token](token.md)[]›*

an observable of Token objects
