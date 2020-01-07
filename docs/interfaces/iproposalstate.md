[@daostack/client](../README.md) › [Globals](../globals.md) › [IProposalState](iproposalstate.md)

# Interface: IProposalState

## Hierarchy

* [IProposalStaticState](iproposalstaticstate.md)

  ↳ **IProposalState**

## Index

### Properties

* [accountsWithUnclaimedRewards](iproposalstate.md#accountswithunclaimedrewards)
* [boostedAt](iproposalstate.md#boostedat)
* [closingAt](iproposalstate.md#closingat)
* [competition](iproposalstate.md#competition)
* [confidenceThreshold](iproposalstate.md#confidencethreshold)
* [contributionReward](iproposalstate.md#contributionreward)
* [createdAt](iproposalstate.md#createdat)
* [dao](iproposalstate.md#dao)
* [description](iproposalstate.md#optional-description)
* [descriptionHash](iproposalstate.md#optional-descriptionhash)
* [downStakeNeededToQueue](iproposalstate.md#downstakeneededtoqueue)
* [executedAt](iproposalstate.md#executedat)
* [executionState](iproposalstate.md#executionstate)
* [expiresInQueueAt](iproposalstate.md#expiresinqueueat)
* [genericScheme](iproposalstate.md#genericscheme)
* [genesisProtocolParams](iproposalstate.md#genesisprotocolparams)
* [id](iproposalstate.md#id)
* [organizationId](iproposalstate.md#organizationid)
* [paramsHash](iproposalstate.md#paramshash)
* [preBoostedAt](iproposalstate.md#preboostedat)
* [proposal](iproposalstate.md#proposal)
* [proposer](iproposalstate.md#proposer)
* [queue](iproposalstate.md#queue)
* [quietEndingPeriodBeganAt](iproposalstate.md#quietendingperiodbeganat)
* [resolvedAt](iproposalstate.md#resolvedat)
* [scheme](iproposalstate.md#scheme)
* [schemeRegistrar](iproposalstate.md#schemeregistrar)
* [stage](iproposalstate.md#stage)
* [stakesAgainst](iproposalstate.md#stakesagainst)
* [stakesFor](iproposalstate.md#stakesfor)
* [tags](iproposalstate.md#optional-tags)
* [title](iproposalstate.md#optional-title)
* [totalRepWhenCreated](iproposalstate.md#totalrepwhencreated)
* [totalRepWhenExecuted](iproposalstate.md#totalrepwhenexecuted)
* [type](iproposalstate.md#type)
* [upstakeNeededToPreBoost](iproposalstate.md#upstakeneededtopreboost)
* [url](iproposalstate.md#optional-url)
* [voteOnBehalf](iproposalstate.md#voteonbehalf)
* [votesAgainst](iproposalstate.md#votesagainst)
* [votesCount](iproposalstate.md#votescount)
* [votesFor](iproposalstate.md#votesfor)
* [votingMachine](iproposalstate.md#votingmachine)
* [winningOutcome](iproposalstate.md#winningoutcome)

## Properties

###  accountsWithUnclaimedRewards

• **accountsWithUnclaimedRewards**: *[Address](../globals.md#address)[]*

*Defined in [proposal.ts:69](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L69)*

___

###  boostedAt

• **boostedAt**: *[Date](../globals.md#date)*

*Defined in [proposal.ts:70](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L70)*

___

###  closingAt

• **closingAt**: *[Date](../globals.md#date)*

*Defined in [proposal.ts:74](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L74)*

___

###  competition

• **competition**: *[ICompetitionProposal](icompetitionproposal.md) | null*

*Defined in [proposal.ts:72](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L72)*

___

###  confidenceThreshold

• **confidenceThreshold**: *number*

*Defined in [proposal.ts:73](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L73)*

___

###  contributionReward

• **contributionReward**: *[IContributionReward](icontributionreward.md) | null*

*Defined in [proposal.ts:71](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L71)*

___

###  createdAt

• **createdAt**: *[Date](../globals.md#date)*

*Defined in [proposal.ts:75](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L75)*

___

###  dao

• **dao**: *[DAO](../classes/dao.md)*

*Inherited from [IProposalStaticState](iproposalstaticstate.md).[dao](iproposalstaticstate.md#dao)*

*Defined in [proposal.ts:63](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L63)*

___

### `Optional` description

• **description**? : *undefined | string*

*Defined in [proposal.ts:77](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L77)*

___

### `Optional` descriptionHash

• **descriptionHash**? : *undefined | string*

*Defined in [proposal.ts:76](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L76)*

___

###  downStakeNeededToQueue

• **downStakeNeededToQueue**: *BN*

*Defined in [proposal.ts:78](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L78)*

___

###  executedAt

• **executedAt**: *[Date](../globals.md#date)*

*Defined in [proposal.ts:79](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L79)*

___

###  executionState

• **executionState**: *[IExecutionState](../enums/iexecutionstate.md)*

*Defined in [proposal.ts:80](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L80)*

___

###  expiresInQueueAt

• **expiresInQueueAt**: *[Date](../globals.md#date)*

*Defined in [proposal.ts:81](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L81)*

___

###  genericScheme

• **genericScheme**: *[IGenericScheme](igenericscheme.md) | null*

*Defined in [proposal.ts:82](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L82)*

___

###  genesisProtocolParams

• **genesisProtocolParams**: *[IGenesisProtocolParams](igenesisprotocolparams.md)*

*Defined in [proposal.ts:83](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L83)*

___

###  id

• **id**: *string*

*Inherited from [IProposalStaticState](iproposalstaticstate.md).[id](iproposalstaticstate.md#id)*

*Defined in [proposal.ts:62](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L62)*

___

###  organizationId

• **organizationId**: *string*

*Defined in [proposal.ts:84](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L84)*

___

###  paramsHash

• **paramsHash**: *string*

*Defined in [proposal.ts:85](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L85)*

___

###  preBoostedAt

• **preBoostedAt**: *[Date](../globals.md#date)*

*Defined in [proposal.ts:86](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L86)*

___

###  proposal

• **proposal**: *[Proposal](../classes/proposal.md)*

*Defined in [proposal.ts:87](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L87)*

___

###  proposer

• **proposer**: *[Address](../globals.md#address)*

*Defined in [proposal.ts:88](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L88)*

___

###  queue

• **queue**: *[IQueueState](iqueuestate.md)*

*Defined in [proposal.ts:89](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L89)*

___

###  quietEndingPeriodBeganAt

• **quietEndingPeriodBeganAt**: *[Date](../globals.md#date)*

*Defined in [proposal.ts:90](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L90)*

___

###  resolvedAt

• **resolvedAt**: *[Date](../globals.md#date)*

*Defined in [proposal.ts:92](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L92)*

___

###  scheme

• **scheme**: *ISchemeState*

*Inherited from [IProposalStaticState](iproposalstaticstate.md).[scheme](iproposalstaticstate.md#scheme)*

*Defined in [proposal.ts:64](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L64)*

___

###  schemeRegistrar

• **schemeRegistrar**: *[ISchemeRegistrar](ischemeregistrar.md) | null*

*Defined in [proposal.ts:91](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L91)*

___

###  stage

• **stage**: *[IProposalStage](../enums/iproposalstage.md)*

*Defined in [proposal.ts:93](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L93)*

___

###  stakesAgainst

• **stakesAgainst**: *BN*

*Defined in [proposal.ts:95](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L95)*

___

###  stakesFor

• **stakesFor**: *BN*

*Defined in [proposal.ts:94](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L94)*

___

### `Optional` tags

• **tags**? : *string[]*

*Defined in [proposal.ts:96](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L96)*

___

### `Optional` title

• **title**? : *undefined | string*

*Defined in [proposal.ts:97](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L97)*

___

###  totalRepWhenCreated

• **totalRepWhenCreated**: *BN*

*Defined in [proposal.ts:98](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L98)*

___

###  totalRepWhenExecuted

• **totalRepWhenExecuted**: *BN*

*Defined in [proposal.ts:99](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L99)*

___

###  type

• **type**: *[IProposalType](../globals.md#const-iproposaltype)*

*Defined in [proposal.ts:100](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L100)*

___

###  upstakeNeededToPreBoost

• **upstakeNeededToPreBoost**: *BN*

*Defined in [proposal.ts:101](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L101)*

___

### `Optional` url

• **url**? : *undefined | string*

*Defined in [proposal.ts:102](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L102)*

___

###  voteOnBehalf

• **voteOnBehalf**: *[Address](../globals.md#address)*

*Defined in [proposal.ts:106](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L106)*

___

###  votesAgainst

• **votesAgainst**: *BN*

*Defined in [proposal.ts:104](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L104)*

___

###  votesCount

• **votesCount**: *number*

*Defined in [proposal.ts:105](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L105)*

___

###  votesFor

• **votesFor**: *BN*

*Defined in [proposal.ts:103](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L103)*

___

###  votingMachine

• **votingMachine**: *[Address](../globals.md#address)*

*Inherited from [IProposalStaticState](iproposalstaticstate.md).[votingMachine](iproposalstaticstate.md#votingmachine)*

*Defined in [proposal.ts:65](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L65)*

___

###  winningOutcome

• **winningOutcome**: *[IProposalOutcome](../enums/iproposaloutcome.md)*

*Defined in [proposal.ts:107](https://github.com/daostack/client/blob/7361fcc/src/proposal.ts#L107)*
