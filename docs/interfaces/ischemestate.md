[@daostack/client](../README.md) › [Globals](../globals.md) › [ISchemeState](ischemestate.md)

# Interface: ISchemeState

## Hierarchy

* [ISchemeStaticState](ischemestaticstate.md)

* ISchemeStaticState

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
* [genericSchemeParams](ischemestate.md#optional-genericschemeparams)
* [id](ischemestate.md#id)
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

*Overrides void*

*Defined in [schemes/base.ts:21](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L21)*

___

###  canDelegateCall

• **canDelegateCall**: *boolean*

*Defined in [schemes/base.ts:29](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L29)*

*Defined in [scheme.ts:32](https://github.com/daostack/client/blob/aa9723f/src/scheme.ts#L32)*

___

###  canManageGlobalConstraints

• **canManageGlobalConstraints**: *boolean*

*Defined in [schemes/base.ts:32](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L32)*

*Defined in [scheme.ts:35](https://github.com/daostack/client/blob/aa9723f/src/scheme.ts#L35)*

___

###  canRegisterSchemes

• **canRegisterSchemes**: *boolean*

*Defined in [schemes/base.ts:30](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L30)*

*Defined in [scheme.ts:33](https://github.com/daostack/client/blob/aa9723f/src/scheme.ts#L33)*

___

###  canUpgradeController

• **canUpgradeController**: *boolean*

*Defined in [schemes/base.ts:31](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L31)*

*Defined in [scheme.ts:34](https://github.com/daostack/client/blob/aa9723f/src/scheme.ts#L34)*

___

### `Optional` contributionRewardExtParams

• **contributionRewardExtParams**? : *[IContributionRewardExtParams](icontributionrewardextparams.md)*

*Defined in [schemes/base.ts:36](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L36)*

*Defined in [scheme.ts:39](https://github.com/daostack/client/blob/aa9723f/src/scheme.ts#L39)*

___

### `Optional` contributionRewardParams

• **contributionRewardParams**? : *[IContributionRewardParams](icontributionrewardparams.md)*

*Defined in [schemes/base.ts:35](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L35)*

*Defined in [scheme.ts:38](https://github.com/daostack/client/blob/aa9723f/src/scheme.ts#L38)*

___

###  dao

• **dao**: *[Address](../globals.md#address)*

*Overrides [ISchemeStaticState](ischemestaticstate.md).[dao](ischemestaticstate.md#dao)*

*Defined in [schemes/base.ts:33](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L33)*

*Defined in [scheme.ts:36](https://github.com/daostack/client/blob/aa9723f/src/scheme.ts#L36)*

___

### `Optional` genericSchemeParams

• **genericSchemeParams**? : *[IGenericSchemeParams](igenericschemeparams.md)*

*Defined in [schemes/base.ts:37](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L37)*

*Defined in [scheme.ts:40](https://github.com/daostack/client/blob/aa9723f/src/scheme.ts#L40)*

___

###  id

• **id**: *string*

*Inherited from [ISchemeStaticState](ischemestaticstate.md).[id](ischemestaticstate.md#id)*

*Overrides void*

*Defined in [schemes/base.ts:20](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L20)*

___

###  name

• **name**: *string*

*Inherited from [ISchemeStaticState](ischemestaticstate.md).[name](ischemestaticstate.md#name)*

*Overrides void*

*Defined in [schemes/base.ts:23](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L23)*

___

###  numberOfBoostedProposals

• **numberOfBoostedProposals**: *number*

*Defined in [schemes/base.ts:45](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L45)*

*Defined in [scheme.ts:48](https://github.com/daostack/client/blob/aa9723f/src/scheme.ts#L48)*

___

###  numberOfPreBoostedProposals

• **numberOfPreBoostedProposals**: *number*

*Defined in [schemes/base.ts:44](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L44)*

*Defined in [scheme.ts:47](https://github.com/daostack/client/blob/aa9723f/src/scheme.ts#L47)*

___

###  numberOfQueuedProposals

• **numberOfQueuedProposals**: *number*

*Defined in [schemes/base.ts:43](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L43)*

*Defined in [scheme.ts:46](https://github.com/daostack/client/blob/aa9723f/src/scheme.ts#L46)*

___

###  paramsHash

• **paramsHash**: *string*

*Overrides [ISchemeStaticState](ischemestaticstate.md).[paramsHash](ischemestaticstate.md#paramshash)*

*Defined in [schemes/base.ts:34](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L34)*

*Defined in [scheme.ts:37](https://github.com/daostack/client/blob/aa9723f/src/scheme.ts#L37)*

___

### `Optional` schemeParams

• **schemeParams**? : *IGenericSchemeParams | IContributionRewardParams | IContributionRewardExtParams | ISchemeRegisterParams*

*Defined in [schemes/base.ts:47](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L47)*

*Defined in [scheme.ts:50](https://github.com/daostack/client/blob/aa9723f/src/scheme.ts#L50)*

___

### `Optional` schemeRegistrarParams

• **schemeRegistrarParams**? : *object | null*

*Defined in [schemes/base.ts:38](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L38)*

*Defined in [scheme.ts:41](https://github.com/daostack/client/blob/aa9723f/src/scheme.ts#L41)*

___

### `Optional` uGenericSchemeParams

• **uGenericSchemeParams**? : *[IGenericSchemeParams](igenericschemeparams.md)*

*Defined in [schemes/base.ts:46](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L46)*

*Defined in [scheme.ts:49](https://github.com/daostack/client/blob/aa9723f/src/scheme.ts#L49)*

___

###  version

• **version**: *string*

*Inherited from [ISchemeStaticState](ischemestaticstate.md).[version](ischemestaticstate.md#version)*

*Overrides void*

*Defined in [schemes/base.ts:25](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L25)*
