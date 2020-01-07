[@daostack/client](../README.md) › [Globals](../globals.md) › [ReputationFromTokenScheme](reputationfromtokenscheme.md)

# Class: ReputationFromTokenScheme

## Hierarchy

* **ReputationFromTokenScheme**

## Index

### Constructors

* [constructor](reputationfromtokenscheme.md#constructor)

### Properties

* [scheme](reputationfromtokenscheme.md#scheme)

### Methods

* [getContract](reputationfromtokenscheme.md#getcontract)
* [redeem](reputationfromtokenscheme.md#redeem)
* [redemptionAmount](reputationfromtokenscheme.md#redemptionamount)

## Constructors

###  constructor

\+ **new ReputationFromTokenScheme**(`scheme`: [Scheme](scheme.md)): *[ReputationFromTokenScheme](reputationfromtokenscheme.md)*

*Defined in [schemes/reputationFromToken.ts:13](https://github.com/daostack/client/blob/7361fcc/src/schemes/reputationFromToken.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`scheme` | [Scheme](scheme.md) |

**Returns:** *[ReputationFromTokenScheme](reputationfromtokenscheme.md)*

## Properties

###  scheme

• **scheme**: *[Scheme](scheme.md)*

*Defined in [schemes/reputationFromToken.ts:15](https://github.com/daostack/client/blob/7361fcc/src/schemes/reputationFromToken.ts#L15)*

## Methods

###  getContract

▸ **getContract**(): *Promise‹any›*

*Defined in [schemes/reputationFromToken.ts:47](https://github.com/daostack/client/blob/7361fcc/src/schemes/reputationFromToken.ts#L47)*

**Returns:** *Promise‹any›*

___

###  redeem

▸ **redeem**(`beneficiary`: [Address](../globals.md#address)): *[Operation](../globals.md#operation)‹any›*

*Defined in [schemes/reputationFromToken.ts:19](https://github.com/daostack/client/blob/7361fcc/src/schemes/reputationFromToken.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiary` | [Address](../globals.md#address) |

**Returns:** *[Operation](../globals.md#operation)‹any›*

___

###  redemptionAmount

▸ **redemptionAmount**(`beneficiary`: [Address](../globals.md#address)): *Promise‹number›*

*Defined in [schemes/reputationFromToken.ts:41](https://github.com/daostack/client/blob/7361fcc/src/schemes/reputationFromToken.ts#L41)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiary` | [Address](../globals.md#address) |

**Returns:** *Promise‹number›*
