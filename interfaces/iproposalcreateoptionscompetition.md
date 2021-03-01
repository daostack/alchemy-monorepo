[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [IProposalCreateOptionsCompetition](iproposalcreateoptionscompetition.md)

# Interface: IProposalCreateOptionsCompetition

## Hierarchy

* [IProposalBaseCreateOptions](iproposalbasecreateoptions.md)

  ↳ **IProposalCreateOptionsCompetition**

## Index

### Properties

* [dao](iproposalcreateoptionscompetition.md#dao)
* [description](iproposalcreateoptionscompetition.md#optional-description)
* [descriptionHash](iproposalcreateoptionscompetition.md#optional-descriptionhash)
* [endTime](iproposalcreateoptionscompetition.md#endtime)
* [ethReward](iproposalcreateoptionscompetition.md#optional-ethreward)
* [externalTokenAddress](iproposalcreateoptionscompetition.md#optional-externaltokenaddress)
* [externalTokenReward](iproposalcreateoptionscompetition.md#optional-externaltokenreward)
* [nativeTokenReward](iproposalcreateoptionscompetition.md#optional-nativetokenreward)
* [numberOfVotesPerVoter](iproposalcreateoptionscompetition.md#numberofvotespervoter)
* [proposalType](iproposalcreateoptionscompetition.md#optional-proposaltype)
* [proposerIsAdmin](iproposalcreateoptionscompetition.md#optional-proposerisadmin)
* [reputationReward](iproposalcreateoptionscompetition.md#optional-reputationreward)
* [rewardSplit](iproposalcreateoptionscompetition.md#rewardsplit)
* [scheme](iproposalcreateoptionscompetition.md#optional-scheme)
* [startTime](iproposalcreateoptionscompetition.md#starttime)
* [suggestionsEndTime](iproposalcreateoptionscompetition.md#suggestionsendtime)
* [tags](iproposalcreateoptionscompetition.md#optional-tags)
* [title](iproposalcreateoptionscompetition.md#optional-title)
* [url](iproposalcreateoptionscompetition.md#optional-url)
* [votingStartTime](iproposalcreateoptionscompetition.md#votingstarttime)

## Properties

###  dao

• **dao**: *[Address](../globals.md#address)*

*Inherited from [IProposalBaseCreateOptions](iproposalbasecreateoptions.md).[dao](iproposalbasecreateoptions.md#dao)*

*Defined in [src/proposal.ts:1014](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L1014)*

___

### `Optional` description

• **description**? : *undefined | string*

*Inherited from [IProposalBaseCreateOptions](iproposalbasecreateoptions.md).[description](iproposalbasecreateoptions.md#optional-description)*

*Defined in [src/proposal.ts:1015](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L1015)*

___

### `Optional` descriptionHash

• **descriptionHash**? : *undefined | string*

*Inherited from [IProposalBaseCreateOptions](iproposalbasecreateoptions.md).[descriptionHash](iproposalbasecreateoptions.md#optional-descriptionhash)*

*Defined in [src/proposal.ts:1016](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L1016)*

___

###  endTime

• **endTime**: *Date*

*Defined in [src/schemes/competition.ts:44](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L44)*

___

### `Optional` ethReward

• **ethReward**? : *BN*

*Defined in [src/schemes/competition.ts:46](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L46)*

___

### `Optional` externalTokenAddress

• **externalTokenAddress**? : *[Address](../globals.md#address)*

*Defined in [src/schemes/competition.ts:48](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L48)*

___

### `Optional` externalTokenReward

• **externalTokenReward**? : *BN*

*Defined in [src/schemes/competition.ts:47](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L47)*

___

### `Optional` nativeTokenReward

• **nativeTokenReward**? : *BN*

*Defined in [src/schemes/competition.ts:51](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L51)*

___

###  numberOfVotesPerVoter

• **numberOfVotesPerVoter**: *number*

*Defined in [src/schemes/competition.ts:52](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L52)*

___

### `Optional` proposalType

• **proposalType**? : *undefined | string*

*Inherited from [IProposalBaseCreateOptions](iproposalbasecreateoptions.md).[proposalType](iproposalbasecreateoptions.md#optional-proposaltype)*

*Defined in [src/proposal.ts:1022](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L1022)*

___

### `Optional` proposerIsAdmin

• **proposerIsAdmin**? : *undefined | false | true*

*Defined in [src/schemes/competition.ts:53](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L53)*

___

### `Optional` reputationReward

• **reputationReward**? : *BN*

*Defined in [src/schemes/competition.ts:45](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L45)*

___

###  rewardSplit

• **rewardSplit**: *number[]*

*Defined in [src/schemes/competition.ts:50](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L50)*

___

### `Optional` scheme

• **scheme**? : *[Address](../globals.md#address)*

*Inherited from [IProposalBaseCreateOptions](iproposalbasecreateoptions.md).[scheme](iproposalbasecreateoptions.md#optional-scheme)*

*Defined in [src/proposal.ts:1019](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L1019)*

___

###  startTime

• **startTime**: *Date | null*

*Defined in [src/schemes/competition.ts:54](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L54)*

___

###  suggestionsEndTime

• **suggestionsEndTime**: *Date*

*Defined in [src/schemes/competition.ts:55](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L55)*

___

### `Optional` tags

• **tags**? : *string[]*

*Inherited from [IProposalBaseCreateOptions](iproposalbasecreateoptions.md).[tags](iproposalbasecreateoptions.md#optional-tags)*

*Defined in [src/proposal.ts:1018](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L1018)*

___

### `Optional` title

• **title**? : *undefined | string*

*Inherited from [IProposalBaseCreateOptions](iproposalbasecreateoptions.md).[title](iproposalbasecreateoptions.md#optional-title)*

*Defined in [src/proposal.ts:1017](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L1017)*

___

### `Optional` url

• **url**? : *undefined | string*

*Inherited from [IProposalBaseCreateOptions](iproposalbasecreateoptions.md).[url](iproposalbasecreateoptions.md#optional-url)*

*Defined in [src/proposal.ts:1020](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/proposal.ts#L1020)*

___

###  votingStartTime

• **votingStartTime**: *Date*

*Defined in [src/schemes/competition.ts:56](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L56)*
