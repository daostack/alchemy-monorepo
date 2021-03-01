[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [CompetitionScheme](competitionscheme.md)

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

* [CTL4R](competitionscheme.md#ctl4r)
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
* [getCompetitionContract](competitionscheme.md#getcompetitioncontract)
* [proposals](competitionscheme.md#proposals)
* [redeemSuggestion](competitionscheme.md#redeemsuggestion)
* [setStaticState](competitionscheme.md#setstaticstate)
* [state](competitionscheme.md#state)
* [voteSuggestion](competitionscheme.md#votesuggestion)

### Object literals

* [fragments](competitionscheme.md#static-fragments)

## Constructors

###  constructor

\+ **new CompetitionScheme**(`idOrOpts`: [Address](../globals.md#address) | [ISchemeStaticState](../interfaces/ischemestaticstate.md), `context`: [Arc](arc.md)): *[CompetitionScheme](competitionscheme.md)*

*Inherited from [SchemeBase](schemebase.md).[constructor](schemebase.md#constructor)*

*Defined in [src/schemes/base.ts:252](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L252)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | [Address](../globals.md#address) &#124; [ISchemeStaticState](../interfaces/ischemestaticstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[CompetitionScheme](competitionscheme.md)*

## Properties

###  CTL4R

• **CTL4R**: *[CL4RScheme](cl4rscheme.md) | null* =  null

*Inherited from [SchemeBase](schemebase.md).[CTL4R](schemebase.md#ctl4r)*

*Defined in [src/schemes/base.ts:252](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L252)*

___

###  ReputationFromToken

• **ReputationFromToken**: *[ReputationFromTokenScheme](reputationfromtokenscheme.md) | null* =  null

*Inherited from [SchemeBase](schemebase.md).[ReputationFromToken](schemebase.md#reputationfromtoken)*

*Defined in [src/schemes/base.ts:251](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L251)*

___

###  context

• **context**: *[Arc](arc.md)*

*Inherited from [SchemeBase](schemebase.md).[context](schemebase.md#context)*

*Defined in [src/schemes/base.ts:254](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L254)*

___

###  id

• **id**: *[Address](../globals.md#address)*

*Inherited from [SchemeBase](schemebase.md).[id](schemebase.md#id)*

*Defined in [src/schemes/base.ts:249](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L249)*

___

###  staticState

• **staticState**: *[ISchemeStaticState](../interfaces/ischemestaticstate.md) | null* =  null

*Inherited from [SchemeBase](schemebase.md).[staticState](schemebase.md#staticstate)*

*Defined in [src/schemes/base.ts:250](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L250)*

## Methods

###  competitions

▸ **competitions**(`options`: [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Competition](competition.md)[]›*

*Defined in [src/schemes/competition.ts:176](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L176)*

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

*Defined in [src/schemes/competition.ts:288](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L288)*

create a proposal for starting a Competition

**`memberof`** CompetitionScheme

**Parameters:**

Name | Type |
------ | ------ |
`options` | [IProposalCreateOptionsCompetition](../interfaces/iproposalcreateoptionscompetition.md) |

**Returns:** *[Operation](../globals.md#operation)‹[Proposal](proposal.md)›*

___

###  createProposalErrorHandler

▸ **createProposalErrorHandler**(`options`: any): *function*

*Overrides [SchemeBase](schemebase.md).[createProposalErrorHandler](schemebase.md#createproposalerrorhandler)*

*Defined in [src/schemes/competition.ts:264](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L264)*

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

*Defined in [src/schemes/competition.ts:196](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L196)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [IProposalCreateOptionsCompetition](../interfaces/iproposalcreateoptionscompetition.md) |

**Returns:** *(Anonymous function)*

___

###  createProposalTransactionMap

▸ **createProposalTransactionMap**(): *txMap*

*Overrides [SchemeBase](schemebase.md).[createProposalTransactionMap](schemebase.md#createproposaltransactionmap)*

*Defined in [src/schemes/competition.ts:255](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L255)*

**Returns:** *txMap*

___

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[ISchemeStaticState](../interfaces/ischemestaticstate.md)›*

*Inherited from [SchemeBase](schemebase.md).[fetchStaticState](schemebase.md#fetchstaticstate)*

*Defined in [src/schemes/base.ts:269](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L269)*

fetch the static state from the subgraph

**Returns:** *Promise‹[ISchemeStaticState](../interfaces/ischemestaticstate.md)›*

the statatic state

___

###  getCompetitionContract

▸ **getCompetitionContract**(): *Promise‹any›*

*Defined in [src/schemes/competition.ts:292](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L292)*

**Returns:** *Promise‹any›*

___

###  proposals

▸ **proposals**(`options`: [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Proposal](proposal.md)[]›*

*Inherited from [SchemeBase](schemebase.md).[proposals](schemebase.md#proposals)*

*Defined in [src/schemes/base.ts:336](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L336)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Proposal](proposal.md)[]›*

___

###  redeemSuggestion

▸ **redeemSuggestion**(`options`: object): *[Operation](../globals.md#operation)‹boolean›*

*Defined in [src/schemes/competition.ts:366](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L366)*

**Parameters:**

▪ **options**: *object*

Name | Type |
------ | ------ |
`suggestionId` | number |

**Returns:** *[Operation](../globals.md#operation)‹boolean›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [ISchemeStaticState](../interfaces/ischemestaticstate.md)): *void*

*Inherited from [SchemeBase](schemebase.md).[setStaticState](schemebase.md#setstaticstate)*

*Defined in [src/schemes/base.ts:295](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L295)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [ISchemeStaticState](../interfaces/ischemestaticstate.md) |

**Returns:** *void*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[ISchemeState](../interfaces/ischemestate.md)›*

*Overrides [SchemeBase](schemebase.md).[state](schemebase.md#abstract-state)*

*Defined in [src/schemes/competition.ts:90](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L90)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[ISchemeState](../interfaces/ischemestate.md)›*

___

###  voteSuggestion

▸ **voteSuggestion**(`options`: object): *[Operation](../globals.md#operation)‹[CompetitionVote](competitionvote.md)›*

*Defined in [src/schemes/competition.ts:307](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/competition.ts#L307)*

Vote for the suggestion that is, in the current scheme, identified by  suggestionId

**`memberof`** CompetitionScheme

**Parameters:**

▪ **options**: *object*

Name | Type |
------ | ------ |
`suggestionId` | number |

**Returns:** *[Operation](../globals.md#operation)‹[CompetitionVote](competitionvote.md)›*

## Object literals

### `Static` fragments

### ▪ **fragments**: *object*

*Inherited from [SchemeBase](schemebase.md).[fragments](schemebase.md#static-fragments)*

*Defined in [src/schemes/base.ts:97](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L97)*

###  SchemeFields

• **SchemeFields**: *DocumentNode* =  gql`
    fragment SchemeFields on ControllerScheme {
      id
      address
      name
      dao { id }
      canDelegateCall
      canRegisterSchemes
      canUpgradeController
      canManageGlobalConstraints
      isRegistered
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
      genericSchemeMultiCallParams {
        votingMachine
        schemeConstraints
        contractsWhiteList
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

*Defined in [src/schemes/base.ts:98](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L98)*
