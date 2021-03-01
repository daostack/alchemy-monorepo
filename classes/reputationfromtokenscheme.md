[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [ReputationFromTokenScheme](reputationfromtokenscheme.md)

# Class: ReputationFromTokenScheme

## Hierarchy

* **ReputationFromTokenScheme**

## Index

### Constructors

* [constructor](reputationfromtokenscheme.md#constructor)

### Properties

* [scheme](reputationfromtokenscheme.md#scheme)

### Methods

* [getAgreementHash](reputationfromtokenscheme.md#getagreementhash)
* [getContract](reputationfromtokenscheme.md#getcontract)
* [redeem](reputationfromtokenscheme.md#redeem)
* [redemptionAmount](reputationfromtokenscheme.md#redemptionamount)

## Constructors

###  constructor

\+ **new ReputationFromTokenScheme**(`scheme`: [Scheme](scheme.md)): *[ReputationFromTokenScheme](reputationfromtokenscheme.md)*

*Defined in [src/schemes/reputationFromToken.ts:13](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/reputationFromToken.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`scheme` | [Scheme](scheme.md) |

**Returns:** *[ReputationFromTokenScheme](reputationfromtokenscheme.md)*

## Properties

###  scheme

• **scheme**: *[Scheme](scheme.md)*

*Defined in [src/schemes/reputationFromToken.ts:15](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/reputationFromToken.ts#L15)*

## Methods

###  getAgreementHash

▸ **getAgreementHash**(): *Promise‹string›*

*Defined in [src/schemes/reputationFromToken.ts:19](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/reputationFromToken.ts#L19)*

**Returns:** *Promise‹string›*

___

###  getContract

▸ **getContract**(): *Promise‹any›*

*Defined in [src/schemes/reputationFromToken.ts:73](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/reputationFromToken.ts#L73)*

**Returns:** *Promise‹any›*

___

###  redeem

▸ **redeem**(`beneficiary`: [Address](../globals.md#address), `agreementHash?`: undefined | string): *[Operation](../globals.md#operation)‹any›*

*Defined in [src/schemes/reputationFromToken.ts:25](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/reputationFromToken.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiary` | [Address](../globals.md#address) |
`agreementHash?` | undefined &#124; string |

**Returns:** *[Operation](../globals.md#operation)‹any›*

___

###  redemptionAmount

▸ **redemptionAmount**(`beneficiary`: [Address](../globals.md#address)): *Promise‹number›*

*Defined in [src/schemes/reputationFromToken.ts:67](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/reputationFromToken.ts#L67)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiary` | [Address](../globals.md#address) |

**Returns:** *Promise‹number›*
