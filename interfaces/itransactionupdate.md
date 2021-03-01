[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [ITransactionUpdate](itransactionupdate.md)

# Interface: ITransactionUpdate ‹**T**›

A transaction update is a snapshot of the state of a transaction at a particular time.

## Type parameters

▪ **T**

## Hierarchy

* **ITransactionUpdate**

## Index

### Properties

* [confirmations](itransactionupdate.md#optional-confirmations)
* [receipt](itransactionupdate.md#optional-receipt)
* [result](itransactionupdate.md#optional-result)
* [state](itransactionupdate.md#state)
* [transactionHash](itransactionupdate.md#optional-transactionhash)

## Properties

### `Optional` confirmations

• **confirmations**? : *undefined | number*

*Defined in [src/operation.ts:23](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/operation.ts#L23)*

 number of confirmations

___

### `Optional` receipt

• **receipt**? : *undefined | object*

*Defined in [src/operation.ts:19](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/operation.ts#L19)*

___

### `Optional` result

• **result**? : *T*

*Defined in [src/operation.ts:28](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/operation.ts#L28)*

Parsed return value from the method call
or contract address in the case of contract creation tx.

___

###  state

• **state**: *[ITransactionState](../enums/itransactionstate.md)*

*Defined in [src/operation.ts:17](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/operation.ts#L17)*

___

### `Optional` transactionHash

• **transactionHash**? : *undefined | string*

*Defined in [src/operation.ts:18](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/operation.ts#L18)*
