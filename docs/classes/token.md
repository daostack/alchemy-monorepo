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

*Defined in [token.ts:86](https://github.com/daostack/client/blob/3edf873/src/token.ts#L86)*

**Parameters:**

Name | Type |
------ | ------ |
`id` | [Address](../globals.md#address) |
`context` | [Arc](arc.md) |

**Returns:** *[Token](token.md)*

## Properties

###  address

• **address**: *string*

*Defined in [token.ts:86](https://github.com/daostack/client/blob/3edf873/src/token.ts#L86)*

___

###  context

• **context**: *[Arc](arc.md)*

*Defined in [token.ts:88](https://github.com/daostack/client/blob/3edf873/src/token.ts#L88)*

___

###  id

• **id**: *[Address](../globals.md#address)*

*Defined in [token.ts:88](https://github.com/daostack/client/blob/3edf873/src/token.ts#L88)*

## Methods

###  allowance

▸ **allowance**(`owner`: [Address](../globals.md#address), `spender`: [Address](../globals.md#address)): *Observable‹any›*

*Defined in [token.ts:172](https://github.com/daostack/client/blob/3edf873/src/token.ts#L172)*

**Parameters:**

Name | Type |
------ | ------ |
`owner` | [Address](../globals.md#address) |
`spender` | [Address](../globals.md#address) |

**Returns:** *Observable‹any›*

___

###  approveForStaking

▸ **approveForStaking**(`spender`: [Address](../globals.md#address), `amount`: any): *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

*Defined in [token.ts:213](https://github.com/daostack/client/blob/3edf873/src/token.ts#L213)*

**Parameters:**

Name | Type |
------ | ------ |
`spender` | [Address](../globals.md#address) |
`amount` | any |

**Returns:** *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

___

###  balanceOf

▸ **balanceOf**(`owner`: string): *Observable‹any›*

*Defined in [token.ts:132](https://github.com/daostack/client/blob/3edf873/src/token.ts#L132)*

**Parameters:**

Name | Type |
------ | ------ |
`owner` | string |

**Returns:** *Observable‹any›*

___

###  contract

▸ **contract**(`mode?`: undefined | "readonly"): *any*

*Defined in [token.ts:127](https://github.com/daostack/client/blob/3edf873/src/token.ts#L127)*

**Parameters:**

Name | Type |
------ | ------ |
`mode?` | undefined &#124; "readonly" |

**Returns:** *any*

___

###  mint

▸ **mint**(`beneficiary`: [Address](../globals.md#address), `amount`: any): *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

*Defined in [token.ts:199](https://github.com/daostack/client/blob/3edf873/src/token.ts#L199)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiary` | [Address](../globals.md#address) |
`amount` | any |

**Returns:** *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[ITokenState](../interfaces/itokenstate.md)›*

*Defined in [token.ts:96](https://github.com/daostack/client/blob/3edf873/src/token.ts#L96)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[ITokenState](../interfaces/itokenstate.md)›*

___

###  transfer

▸ **transfer**(`beneficiary`: [Address](../globals.md#address), `amount`: any): *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

*Defined in [token.ts:206](https://github.com/daostack/client/blob/3edf873/src/token.ts#L206)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiary` | [Address](../globals.md#address) |
`amount` | any |

**Returns:** *[IOperationObservable](../interfaces/ioperationobservable.md)‹[ITransactionUpdate](../interfaces/itransactionupdate.md)‹any››*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [ITokenQueryOptions](../interfaces/itokenqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Token](token.md)[]›*

*Defined in [token.ts:52](https://github.com/daostack/client/blob/3edf873/src/token.ts#L52)*

Token.search(context, options) searches for token entities

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | an Arc instance that provides connection information |
`options` | [ITokenQueryOptions](../interfaces/itokenqueryoptions.md) |  {} | the query options, cf. ITokenQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹[Token](token.md)[]›*

an observable of Token objects
