[@daostack/client](../README.md) › [Globals](../globals.md) › [IProposalCreateOptionsCompetition](iproposalcreateoptionscompetition.md)

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

*Defined in [proposal.ts:871](https://github.com/daostack/client/blob/1bc237e/src/proposal.ts#L871)*

___

### `Optional` description

• **description**? : *undefined | string*

*Inherited from [IProposalBaseCreateOptions](iproposalbasecreateoptions.md).[description](iproposalbasecreateoptions.md#optional-description)*

*Defined in [proposal.ts:872](https://github.com/daostack/client/blob/1bc237e/src/proposal.ts#L872)*

___

### `Optional` descriptionHash

• **descriptionHash**? : *undefined | string*

*Inherited from [IProposalBaseCreateOptions](iproposalbasecreateoptions.md).[descriptionHash](iproposalbasecreateoptions.md#optional-descriptionhash)*

*Defined in [proposal.ts:873](https://github.com/daostack/client/blob/1bc237e/src/proposal.ts#L873)*

___

###  endTime

• **endTime**: *Date*

*Defined in [schemes/competition.ts:38](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L38)*

___

### `Optional` ethReward

• **ethReward**? : *BN*

*Defined in [schemes/competition.ts:40](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L40)*

___

### `Optional` externalTokenAddress

• **externalTokenAddress**? : *[Address](../globals.md#address)*

*Defined in [schemes/competition.ts:42](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L42)*

___

### `Optional` externalTokenReward

• **externalTokenReward**? : *BN*

*Defined in [schemes/competition.ts:41](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L41)*

___

### `Optional` nativeTokenReward

• **nativeTokenReward**? : *BN*

*Defined in [schemes/competition.ts:45](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L45)*

___

###  numberOfVotesPerVoter

• **numberOfVotesPerVoter**: *number*

*Defined in [schemes/competition.ts:46](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L46)*

___

### `Optional` proposalType

• **proposalType**? : *undefined | string*

*Inherited from [IProposalBaseCreateOptions](iproposalbasecreateoptions.md).[proposalType](iproposalbasecreateoptions.md#optional-proposaltype)*

*Defined in [proposal.ts:879](https://github.com/daostack/client/blob/1bc237e/src/proposal.ts#L879)*

___

### `Optional` reputationReward

• **reputationReward**? : *BN*

*Defined in [schemes/competition.ts:39](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L39)*

___

###  rewardSplit

• **rewardSplit**: *number[]*

*Defined in [schemes/competition.ts:44](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L44)*

___

### `Optional` scheme

• **scheme**? : *[Address](../globals.md#address)*

*Inherited from [IProposalBaseCreateOptions](iproposalbasecreateoptions.md).[scheme](iproposalbasecreateoptions.md#optional-scheme)*

*Defined in [proposal.ts:876](https://github.com/daostack/client/blob/1bc237e/src/proposal.ts#L876)*

___

###  startTime

• **startTime**: *Date | null*

*Defined in [schemes/competition.ts:47](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L47)*

___

###  suggestionsEndTime

• **suggestionsEndTime**: *Date*

*Defined in [schemes/competition.ts:48](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L48)*

___

### `Optional` tags

• **tags**? : *string[]*

*Inherited from [IProposalBaseCreateOptions](iproposalbasecreateoptions.md).[tags](iproposalbasecreateoptions.md#optional-tags)*

*Defined in [proposal.ts:875](https://github.com/daostack/client/blob/1bc237e/src/proposal.ts#L875)*

___

### `Optional` title

• **title**? : *undefined | string*

*Inherited from [IProposalBaseCreateOptions](iproposalbasecreateoptions.md).[title](iproposalbasecreateoptions.md#optional-title)*

*Defined in [proposal.ts:874](https://github.com/daostack/client/blob/1bc237e/src/proposal.ts#L874)*

___

### `Optional` url

• **url**? : *undefined | string*

*Inherited from [IProposalBaseCreateOptions](iproposalbasecreateoptions.md).[url](iproposalbasecreateoptions.md#optional-url)*

*Defined in [proposal.ts:877](https://github.com/daostack/client/blob/1bc237e/src/proposal.ts#L877)*

___

###  votingStartTime

• **votingStartTime**: *Date*

*Defined in [schemes/competition.ts:49](https://github.com/daostack/client/blob/1bc237e/src/schemes/competition.ts#L49)*
