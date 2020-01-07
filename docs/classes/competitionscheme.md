[@daostack/client](../README.md) › [Globals](../globals.md) › [CompetitionScheme](competitionscheme.md)

# Class: CompetitionScheme

## Hierarchy

* [SchemeBase](schemebase.md)

  ↳ **CompetitionScheme**

## Implements

* [IStateful](../interfaces/istateful.md)‹[ISchemeState](../interfaces/ischemestate.md)›

## Index

### Constructors

* [constructor](competitionscheme.md#constructor)

### Properties

* [ReputationFromToken](competitionscheme.md#reputationfromtoken)
* [context](competitionscheme.md#context)
* [id](competitionscheme.md#id)
* [staticState](competitionscheme.md#staticstate)

### Methods

* [competitions](competitionscheme.md#competitions)
* [createProposal](competitionscheme.md#createproposal)
* [createProposalErrorHandler](competitionscheme.md#createproposalerrorhandler)
* [createProposalTransaction](competitionscheme.md#createproposaltransaction)
* [createProposalTransactionMap](competitionscheme.md#createproposaltransactionmap)
* [fetchStaticState](competitionscheme.md#fetchstaticstate)
* [proposals](competitionscheme.md#proposals)
* [redeemSuggestion](competitionscheme.md#redeemsuggestion)
* [setStaticState](competitionscheme.md#setstaticstate)
* [state](competitionscheme.md#state)
* [voteSuggestion](competitionscheme.md#votesuggestion)
* [x](competitionscheme.md#x)

### Object literals

* [fragments](competitionscheme.md#static-fragments)

## Constructors

###  constructor

\+ **new CompetitionScheme**(`idOrOpts`: [Address](../globals.md#address) | [ISchemeStaticState](../interfaces/ischemestaticstate.md), `context`: [Arc](arc.md)): *[CompetitionScheme](competitionscheme.md)*

*Inherited from [SchemeBase](schemebase.md).[constructor](schemebase.md#constructor)*

*Defined in [schemes/base.ts:239](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L239)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | [Address](../globals.md#address) &#124; [ISchemeStaticState](../interfaces/ischemestaticstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[CompetitionScheme](competitionscheme.md)*

## Properties

###  ReputationFromToken

• **ReputationFromToken**: *[ReputationFromTokenScheme](reputationfromtokenscheme.md) | null* =  null

*Inherited from [SchemeBase](schemebase.md).[ReputationFromToken](schemebase.md#reputationfromtoken)*

*Defined in [schemes/base.ts:239](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L239)*

___

###  context

• **context**: *[Arc](arc.md)*

*Inherited from [SchemeBase](schemebase.md).[context](schemebase.md#context)*

*Defined in [schemes/base.ts:241](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L241)*

___

###  id

• **id**: *[Address](../globals.md#address)*

*Inherited from [SchemeBase](schemebase.md).[id](schemebase.md#id)*

*Defined in [schemes/base.ts:237](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L237)*

___

###  staticState

• **staticState**: *[ISchemeStaticState](../interfaces/ischemestaticstate.md) | null* =  null

*Inherited from [SchemeBase](schemebase.md).[staticState](schemebase.md#staticstate)*

*Defined in [schemes/base.ts:238](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L238)*

## Methods

###  competitions

▸ **competitions**(`options`: [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Competition](competition.md)[]›*

*Defined in [schemes/competition.ts:168](https://github.com/daostack/client/blob/aa9723f/src/schemes/competition.ts#L168)*

Return a list of competitions in this scheme.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`options` | [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md) |  {} | - |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |   |

**Returns:** *Observable‹[Competition](competition.md)[]›*

___

###  createProposal

▸ **createProposal**(`options`: [IProposalCreateOptionsCompetition](../interfaces/iproposalcreateoptionscompetition.md)): *[Operation](../globals.md#operation)‹[Proposal](proposal.md)›*

*Overrides [SchemeBase](schemebase.md).[createProposal](schemebase.md#createproposal)*

*Defined in [schemes/competition.ts:263](https://github.com/daostack/client/blob/aa9723f/src/schemes/competition.ts#L263)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [IProposalCreateOptionsCompetition](../interfaces/iproposalcreateoptionscompetition.md) |

**Returns:** *[Operation](../globals.md#operation)‹[Proposal](proposal.md)›*

___

###  createProposalErrorHandler

▸ **createProposalErrorHandler**(`options`: any): *function*

*Overrides [SchemeBase](schemebase.md).[createProposalErrorHandler](schemebase.md#createproposalerrorhandler)*

*Defined in [schemes/competition.ts:254](https://github.com/daostack/client/blob/aa9723f/src/schemes/competition.ts#L254)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | any |

**Returns:** *function*

▸ (`err`: Error): *Error | Promise‹Error›*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error |

___

###  createProposalTransaction

▸ **createProposalTransaction**(`options`: [IProposalCreateOptionsCompetition](../interfaces/iproposalcreateoptionscompetition.md)): *(Anonymous function)*

*Overrides [SchemeBase](schemebase.md).[createProposalTransaction](schemebase.md#createproposaltransaction)*

*Defined in [schemes/competition.ts:188](https://github.com/daostack/client/blob/aa9723f/src/schemes/competition.ts#L188)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [IProposalCreateOptionsCompetition](../interfaces/iproposalcreateoptionscompetition.md) |

**Returns:** *(Anonymous function)*

___

###  createProposalTransactionMap

▸ **createProposalTransactionMap**(): *txMap*

*Overrides [SchemeBase](schemebase.md).[createProposalTransactionMap](schemebase.md#createproposaltransactionmap)*

*Defined in [schemes/competition.ts:245](https://github.com/daostack/client/blob/aa9723f/src/schemes/competition.ts#L245)*

**Returns:** *txMap*

___

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[ISchemeStaticState](../interfaces/ischemestaticstate.md)›*

*Inherited from [SchemeBase](schemebase.md).[fetchStaticState](schemebase.md#fetchstaticstate)*

*Defined in [schemes/base.ts:256](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L256)*

fetch the static state from the subgraph

**Returns:** *Promise‹[ISchemeStaticState](../interfaces/ischemestaticstate.md)›*

the statatic state

___

###  proposals

▸ **proposals**(`options`: [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Proposal](proposal.md)[]›*

*Inherited from [SchemeBase](schemebase.md).[proposals](schemebase.md#proposals)*

*Defined in [schemes/base.ts:467](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L467)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Proposal](proposal.md)[]›*

___

###  redeemSuggestion

▸ **redeemSuggestion**(`options`: object): *[Operation](../globals.md#operation)‹boolean›*

*Defined in [schemes/competition.ts:316](https://github.com/daostack/client/blob/aa9723f/src/schemes/competition.ts#L316)*

**Parameters:**

▪ **options**: *object*

Name | Type |
------ | ------ |
`beneficiary` | [Address](../globals.md#address) |
`suggestionId` | number |

**Returns:** *[Operation](../globals.md#operation)‹boolean›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [ISchemeStaticState](../interfaces/ischemestaticstate.md)): *void*

*Inherited from [SchemeBase](schemebase.md).[setStaticState](schemebase.md#setstaticstate)*

*Defined in [schemes/base.ts:279](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L279)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [ISchemeStaticState](../interfaces/ischemestaticstate.md) |

**Returns:** *void*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[ISchemeState](../interfaces/ischemestate.md)›*

*Overrides [SchemeBase](schemebase.md).[state](schemebase.md#abstract-state)*

*Defined in [schemes/competition.ts:83](https://github.com/daostack/client/blob/aa9723f/src/schemes/competition.ts#L83)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[ISchemeState](../interfaces/ischemestate.md)›*

___

###  voteSuggestion

▸ **voteSuggestion**(`options`: object): *[Operation](../globals.md#operation)‹[CompetitionVote](competitionvote.md)›*

*Defined in [schemes/competition.ts:267](https://github.com/daostack/client/blob/aa9723f/src/schemes/competition.ts#L267)*

**Parameters:**

▪ **options**: *object*

Name | Type |
------ | ------ |
`suggestionId` | number |

**Returns:** *[Operation](../globals.md#operation)‹[CompetitionVote](competitionvote.md)›*

___

###  x

▸ **x**(): *void*

*Inherited from [SchemeBase](schemebase.md).[x](schemebase.md#x)*

*Defined in [schemes/base.ts:319](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L319)*

**Returns:** *void*

## Object literals

### `Static` fragments

### ▪ **fragments**: *object*

*Inherited from [SchemeBase](schemebase.md).[fragments](schemebase.md#static-fragments)*

*Defined in [schemes/base.ts:106](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L106)*

###  SchemeFields

• **SchemeFields**: *any* =  gql`
    fragment SchemeFields on ControllerScheme {
      id
      address
      name
      dao { id }
      canDelegateCall
      canRegisterSchemes
      canUpgradeController
      canManageGlobalConstraints
      paramsHash
      contributionRewardParams {
        id
        votingMachine
        voteParams {
          id
          queuedVoteRequiredPercentage
          queuedVotePeriodLimit
          boostedVotePeriodLimit
          preBoostedVotePeriodLimit
          thresholdConst
          limitExponentValue
          quietEndingPeriod
          proposingRepReward
          votersReputationLossRatio
          minimumDaoBounty
          daoBountyConst
          activationTime
          voteOnBehalf
        }
      }
      contributionRewardExtParams {
        id
        votingMachine
        voteParams {
          id
          queuedVoteRequiredPercentage
          queuedVotePeriodLimit
          boostedVotePeriodLimit
          preBoostedVotePeriodLimit
          thresholdConst
          limitExponentValue
          quietEndingPeriod
          proposingRepReward
          votersReputationLossRatio
          minimumDaoBounty
          daoBountyConst
          activationTime
          voteOnBehalf
        }
        rewarder
      }
      genericSchemeParams {
        votingMachine
        contractToCall
        voteParams {
          queuedVoteRequiredPercentage
          queuedVotePeriodLimit
          boostedVotePeriodLimit
          preBoostedVotePeriodLimit
          thresholdConst
          limitExponentValue
          quietEndingPeriod
          proposingRepReward
          votersReputationLossRatio
          minimumDaoBounty
          daoBountyConst
          activationTime
          voteOnBehalf
        }
      }
      schemeRegistrarParams {
        votingMachine
        voteRemoveParams {
          queuedVoteRequiredPercentage
          queuedVotePeriodLimit
          boostedVotePeriodLimit
          preBoostedVotePeriodLimit
          thresholdConst
          limitExponentValue
          quietEndingPeriod
          proposingRepReward
          votersReputationLossRatio
          minimumDaoBounty
          daoBountyConst
          activationTime
          voteOnBehalf
        }
        voteRegisterParams {
          queuedVoteRequiredPercentage
          queuedVotePeriodLimit
          boostedVotePeriodLimit
          preBoostedVotePeriodLimit
          thresholdConst
          limitExponentValue
          quietEndingPeriod
          proposingRepReward
          votersReputationLossRatio
          minimumDaoBounty
          daoBountyConst
          activationTime
          voteOnBehalf
        }
      }
      numberOfQueuedProposals
      numberOfPreBoostedProposals
      numberOfBoostedProposals
      uGenericSchemeParams {
        votingMachine
        contractToCall
        voteParams {
          queuedVoteRequiredPercentage
          queuedVotePeriodLimit
          boostedVotePeriodLimit
          preBoostedVotePeriodLimit
          thresholdConst
          limitExponentValue
          quietEndingPeriod
          proposingRepReward
          votersReputationLossRatio
          minimumDaoBounty
          daoBountyConst
          activationTime
          voteOnBehalf
        }
      }
      version
    }`

*Defined in [schemes/base.ts:107](https://github.com/daostack/client/blob/aa9723f/src/schemes/base.ts#L107)*
