[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [ISchemeState](ischemestate.md)

# Interface: ISchemeState

## Hierarchy

* [ISchemeStaticState](ischemestaticstate.md)

  ↳ **ISchemeState**

## Index

### Properties

* [address](ischemestate.md#address)
* [canDelegateCall](ischemestate.md#candelegatecall)
* [canManageGlobalConstraints](ischemestate.md#canmanageglobalconstraints)
* [canRegisterSchemes](ischemestate.md#canregisterschemes)
* [canUpgradeController](ischemestate.md#canupgradecontroller)
* [contributionRewardExtParams](ischemestate.md#optional-contributionrewardextparams)
* [contributionRewardParams](ischemestate.md#optional-contributionrewardparams)
* [dao](ischemestate.md#dao)
* [genericSchemeMultiCallParams](ischemestate.md#optional-genericschememulticallparams)
* [genericSchemeParams](ischemestate.md#optional-genericschemeparams)
* [id](ischemestate.md#id)
* [isRegistered](ischemestate.md#isregistered)
* [name](ischemestate.md#name)
* [numberOfBoostedProposals](ischemestate.md#numberofboostedproposals)
* [numberOfPreBoostedProposals](ischemestate.md#numberofpreboostedproposals)
* [numberOfQueuedProposals](ischemestate.md#numberofqueuedproposals)
* [paramsHash](ischemestate.md#paramshash)
* [schemeParams](ischemestate.md#optional-schemeparams)
* [schemeRegistrarParams](ischemestate.md#optional-schemeregistrarparams)
* [uGenericSchemeParams](ischemestate.md#optional-ugenericschemeparams)
* [version](ischemestate.md#version)

## Properties

###  address

• **address**: *[Address](../globals.md#address)*

*Inherited from [ISchemeStaticState](ischemestaticstate.md).[address](ischemestaticstate.md#address)*

*Defined in [src/schemes/base.ts:16](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L16)*

___

###  canDelegateCall

• **canDelegateCall**: *boolean*

*Defined in [src/schemes/base.ts:24](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L24)*

___

###  canManageGlobalConstraints

• **canManageGlobalConstraints**: *boolean*

*Defined in [src/schemes/base.ts:27](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L27)*

___

###  canRegisterSchemes

• **canRegisterSchemes**: *boolean*

*Defined in [src/schemes/base.ts:25](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L25)*

___

###  canUpgradeController

• **canUpgradeController**: *boolean*

*Defined in [src/schemes/base.ts:26](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L26)*

___

### `Optional` contributionRewardExtParams

• **contributionRewardExtParams**? : *[IContributionRewardExtParams](icontributionrewardextparams.md)*

*Defined in [src/schemes/base.ts:32](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L32)*

___

### `Optional` contributionRewardParams

• **contributionRewardParams**? : *[IContributionRewardParams](icontributionrewardparams.md)*

*Defined in [src/schemes/base.ts:31](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L31)*

___

###  dao

• **dao**: *[Address](../globals.md#address)*

*Overrides [ISchemeStaticState](ischemestaticstate.md).[dao](ischemestaticstate.md#dao)*

*Defined in [src/schemes/base.ts:28](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L28)*

___

### `Optional` genericSchemeMultiCallParams

• **genericSchemeMultiCallParams**? : *[IGenericSchemeMultiCallParams](igenericschememulticallparams.md)*

*Defined in [src/schemes/base.ts:34](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L34)*

___

### `Optional` genericSchemeParams

• **genericSchemeParams**? : *[IGenericSchemeParams](igenericschemeparams.md)*

*Defined in [src/schemes/base.ts:33](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L33)*

___

###  id

• **id**: *string*

*Inherited from [ISchemeStaticState](ischemestaticstate.md).[id](ischemestaticstate.md#id)*

*Defined in [src/schemes/base.ts:15](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L15)*

___

###  isRegistered

• **isRegistered**: *boolean*

*Defined in [src/schemes/base.ts:29](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L29)*

___

###  name

• **name**: *string*

*Inherited from [ISchemeStaticState](ischemestaticstate.md).[name](ischemestaticstate.md#name)*

*Defined in [src/schemes/base.ts:18](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L18)*

___

###  numberOfBoostedProposals

• **numberOfBoostedProposals**: *number*

*Defined in [src/schemes/base.ts:42](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L42)*

___

###  numberOfPreBoostedProposals

• **numberOfPreBoostedProposals**: *number*

*Defined in [src/schemes/base.ts:41](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L41)*

___

###  numberOfQueuedProposals

• **numberOfQueuedProposals**: *number*

*Defined in [src/schemes/base.ts:40](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L40)*

___

###  paramsHash

• **paramsHash**: *string*

*Overrides [ISchemeStaticState](ischemestaticstate.md).[paramsHash](ischemestaticstate.md#paramshash)*

*Defined in [src/schemes/base.ts:30](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L30)*

___

### `Optional` schemeParams

• **schemeParams**? : *[IGenericSchemeParams](igenericschemeparams.md) | [IGenericSchemeMultiCallParams](igenericschememulticallparams.md) | [IContributionRewardParams](icontributionrewardparams.md) | [IContributionRewardExtParams](icontributionrewardextparams.md) | [ISchemeRegisterParams](ischemeregisterparams.md)*

*Defined in [src/schemes/base.ts:44](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L44)*

___

### `Optional` schemeRegistrarParams

• **schemeRegistrarParams**? : *object | null*

*Defined in [src/schemes/base.ts:35](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L35)*

___

### `Optional` uGenericSchemeParams

• **uGenericSchemeParams**? : *[IGenericSchemeParams](igenericschemeparams.md)*

*Defined in [src/schemes/base.ts:43](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L43)*

___

###  version

• **version**: *string*

*Inherited from [ISchemeStaticState](ischemestaticstate.md).[version](ischemestaticstate.md#version)*

*Defined in [src/schemes/base.ts:20](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L20)*
