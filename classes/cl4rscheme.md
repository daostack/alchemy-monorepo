[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [CL4RScheme](cl4rscheme.md)

# Class: CL4RScheme

## Hierarchy

* **CL4RScheme**

## Index

### Constructors

* [constructor](cl4rscheme.md#constructor)

### Properties

* [scheme](cl4rscheme.md#scheme)

### Methods

* [extendLocking](cl4rscheme.md#extendlocking)
* [getAgreementHash](cl4rscheme.md#getagreementhash)
* [getCT4RRedeemer](cl4rscheme.md#getct4rredeemer)
* [getContract](cl4rscheme.md#getcontract)
* [getContractAddress](cl4rscheme.md#getcontractaddress)
* [getRepuationRewardForBatch](cl4rscheme.md#getrepuationrewardforbatch)
* [getReputationRewardForLockingIds](cl4rscheme.md#getreputationrewardforlockingids)
* [getScheme](cl4rscheme.md#getscheme)
* [lock](cl4rscheme.md#lock)
* [redeem](cl4rscheme.md#redeem)
* [release](cl4rscheme.md#release)

## Constructors

###  constructor

\+ **new CL4RScheme**(`scheme`: [Scheme](scheme.md)): *[CL4RScheme](cl4rscheme.md)*

*Defined in [src/schemes/cl4rep.ts:54](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/cl4rep.ts#L54)*

**Parameters:**

Name | Type |
------ | ------ |
`scheme` | [Scheme](scheme.md) |

**Returns:** *[CL4RScheme](cl4rscheme.md)*

## Properties

###  scheme

• **scheme**: *[Scheme](scheme.md)*

*Defined in [src/schemes/cl4rep.ts:56](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/cl4rep.ts#L56)*

## Methods

###  extendLocking

▸ **extendLocking**(`extendPeriod`: number, `batchIndexToLockIn`: number, `lockingId`: number, `agreementHash`: string): *[Operation](../globals.md#operation)‹any›*

*Defined in [src/schemes/cl4rep.ts:131](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/cl4rep.ts#L131)*

**Parameters:**

Name | Type |
------ | ------ |
`extendPeriod` | number |
`batchIndexToLockIn` | number |
`lockingId` | number |
`agreementHash` | string |

**Returns:** *[Operation](../globals.md#operation)‹any›*

___

###  getAgreementHash

▸ **getAgreementHash**(): *Promise‹string›*

*Defined in [src/schemes/cl4rep.ts:78](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/cl4rep.ts#L78)*

**Returns:** *Promise‹string›*

___

###  getCT4RRedeemer

▸ **getCT4RRedeemer**(`ct4rRedeemerAddress?`: [Address](../globals.md#address)): *Promise‹any›*

*Defined in [src/schemes/cl4rep.ts:239](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/cl4rep.ts#L239)*

**Parameters:**

Name | Type |
------ | ------ |
`ct4rRedeemerAddress?` | [Address](../globals.md#address) |

**Returns:** *Promise‹any›*

___

###  getContract

▸ **getContract**(): *Promise‹any›*

*Defined in [src/schemes/cl4rep.ts:228](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/cl4rep.ts#L228)*

**Returns:** *Promise‹any›*

___

###  getContractAddress

▸ **getContractAddress**(): *Promise‹string›*

*Defined in [src/schemes/cl4rep.ts:235](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/cl4rep.ts#L235)*

**Returns:** *Promise‹string›*

___

###  getRepuationRewardForBatch

▸ **getRepuationRewardForBatch**(`repRewardConstA`: string, `repRewardConstB`: string, `batchIndex`: number): *Promise‹Decimal›*

*Defined in [src/schemes/cl4rep.ts:69](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/cl4rep.ts#L69)*

getRepuationRewardForBatch
according to the formula
repPerBatch = _repRewardConstA * ((_repRewardConstB/1000) ** batchIndex)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`repRewardConstA` | string | - |
`repRewardConstB` | string | - |
`batchIndex` | number | the batchIndex to calculate |

**Returns:** *Promise‹Decimal›*

RepuationRewardForBatch

___

###  getReputationRewardForLockingIds

▸ **getReputationRewardForLockingIds**(`lockingIds`: number[], `batchIndex`: number, `repuationRewardForPeriod`: Decimal): *Promise‹Decimal›*

*Defined in [src/schemes/cl4rep.ts:84](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/cl4rep.ts#L84)*

**Parameters:**

Name | Type |
------ | ------ |
`lockingIds` | number[] |
`batchIndex` | number |
`repuationRewardForPeriod` | Decimal |

**Returns:** *Promise‹Decimal›*

___

###  getScheme

▸ **getScheme**(): *[Scheme](scheme.md)‹›*

*Defined in [src/schemes/cl4rep.ts:243](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/cl4rep.ts#L243)*

**Returns:** *[Scheme](scheme.md)‹›*

___

###  lock

▸ **lock**(`amount`: BN, `period`: number, `batchIndexToLockIn`: number, `agreementHash`: string): *[Operation](../globals.md#operation)‹any›*

*Defined in [src/schemes/cl4rep.ts:102](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/cl4rep.ts#L102)*

**Parameters:**

Name | Type |
------ | ------ |
`amount` | BN |
`period` | number |
`batchIndexToLockIn` | number |
`agreementHash` | string |

**Returns:** *[Operation](../globals.md#operation)‹any›*

___

###  redeem

▸ **redeem**(`beneficiary`: [Address](../globals.md#address), `lockingIds`: number[], `ct4rRedeemerAddress?`: [Address](../globals.md#address)): *[Operation](../globals.md#operation)‹any›*

*Defined in [src/schemes/cl4rep.ts:196](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/cl4rep.ts#L196)*

redeem redeem reputation for a beneficiary for all is lockingIds

**Parameters:**

Name | Type |
------ | ------ |
`beneficiary` | [Address](../globals.md#address) |
`lockingIds` | number[] |
`ct4rRedeemerAddress?` | [Address](../globals.md#address) |

**Returns:** *[Operation](../globals.md#operation)‹any›*

RepuationRewardForBatch

___

###  release

▸ **release**(`beneficiary`: [Address](../globals.md#address), `lockingId`: number): *[Operation](../globals.md#operation)‹any›*

*Defined in [src/schemes/cl4rep.ts:162](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/cl4rep.ts#L162)*

**Parameters:**

Name | Type |
------ | ------ |
`beneficiary` | [Address](../globals.md#address) |
`lockingId` | number |

**Returns:** *[Operation](../globals.md#operation)‹any›*
