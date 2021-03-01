[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [Scheme](scheme.md)

# Class: Scheme

A Scheme represents a scheme instance that is registered at a DAO

## Hierarchy

* [SchemeBase](schemebase.md)

  ↳ **Scheme**

## Implements

* [IStateful](../interfaces/istateful.md)‹[ISchemeState](../interfaces/ischemestate.md)›

## Index

### Constructors

* [constructor](scheme.md#constructor)

### Properties

* [CTL4R](scheme.md#ctl4r)
* [ReputationFromToken](scheme.md#reputationfromtoken)
* [context](scheme.md#context)
* [id](scheme.md#id)
* [staticState](scheme.md#staticstate)

### Methods

* [createProposal](scheme.md#createproposal)
* [createProposalErrorHandler](scheme.md#createproposalerrorhandler)
* [createProposalTransaction](scheme.md#createproposaltransaction)
* [createProposalTransactionMap](scheme.md#createproposaltransactionmap)
* [fetchStaticState](scheme.md#fetchstaticstate)
* [proposals](scheme.md#proposals)
* [setStaticState](scheme.md#setstaticstate)
* [state](scheme.md#state)
* [itemMap](scheme.md#static-itemmap)
* [search](scheme.md#static-search)

### Object literals

* [fragments](scheme.md#static-fragments)

## Constructors

###  constructor

\+ **new Scheme**(`idOrOpts`: [Address](../globals.md#address) | [ISchemeStaticState](../interfaces/ischemestaticstate.md), `context`: [Arc](arc.md)): *[Scheme](scheme.md)*

*Overrides [SchemeBase](schemebase.md).[constructor](schemebase.md#constructor)*

*Defined in [src/scheme.ts:188](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/scheme.ts#L188)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | [Address](../globals.md#address) &#124; [ISchemeStaticState](../interfaces/ischemestaticstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[Scheme](scheme.md)*

## Properties

###  CTL4R

• **CTL4R**: *[CL4RScheme](cl4rscheme.md) | null* =  null

*Overrides [SchemeBase](schemebase.md).[CTL4R](schemebase.md#ctl4r)*

*Defined in [src/scheme.ts:188](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/scheme.ts#L188)*

___

###  ReputationFromToken

• **ReputationFromToken**: *[ReputationFromTokenScheme](reputationfromtokenscheme.md) | null* =  null

*Overrides [SchemeBase](schemebase.md).[ReputationFromToken](schemebase.md#reputationfromtoken)*

*Defined in [src/scheme.ts:187](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/scheme.ts#L187)*

___

###  context

• **context**: *[Arc](arc.md)*

*Overrides [SchemeBase](schemebase.md).[context](schemebase.md#context)*

*Defined in [src/scheme.ts:190](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/scheme.ts#L190)*

___

###  id

• **id**: *[Address](../globals.md#address)*

*Overrides [SchemeBase](schemebase.md).[id](schemebase.md#id)*

*Defined in [src/scheme.ts:185](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/scheme.ts#L185)*

___

###  staticState

• **staticState**: *[ISchemeStaticState](../interfaces/ischemestaticstate.md) | null* =  null

*Overrides [SchemeBase](schemebase.md).[staticState](schemebase.md#staticstate)*

*Defined in [src/scheme.ts:186](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/scheme.ts#L186)*

## Methods

###  createProposal

▸ **createProposal**(`options`: [IProposalCreateOptions](../globals.md#iproposalcreateoptions)): *[Operation](../globals.md#operation)‹[Proposal](proposal.md)›*

*Overrides [SchemeBase](schemebase.md).[createProposal](schemebase.md#createproposal)*

*Defined in [src/scheme.ts:255](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/scheme.ts#L255)*

create a new proposal in this Scheme

**Parameters:**

Name | Type |
------ | ------ |
`options` | [IProposalCreateOptions](../globals.md#iproposalcreateoptions) |

**Returns:** *[Operation](../globals.md#operation)‹[Proposal](proposal.md)›*

a Proposal instance

___

###  createProposalErrorHandler

▸ **createProposalErrorHandler**(`options?`: any): *function | undefined*

*Inherited from [SchemeBase](schemebase.md).[createProposalErrorHandler](schemebase.md#createproposalerrorhandler)*

*Defined in [src/schemes/base.ts:312](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L312)*

**Parameters:**

Name | Type |
------ | ------ |
`options?` | any |

**Returns:** *function | undefined*

___

###  createProposalTransaction

▸ **createProposalTransaction**(`options`: any): *function*

*Inherited from [SchemeBase](schemebase.md).[createProposalTransaction](schemebase.md#createproposaltransaction)*

*Defined in [src/schemes/base.ts:304](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L304)*

create a new proposal in this scheme
TODO: move this to the schemes - we should call proposal.scheme.createProposal

**Parameters:**

Name | Type |
------ | ------ |
`options` | any |

**Returns:** *function*

a Proposal instance

▸ (): *Promise‹any›*

___

###  createProposalTransactionMap

▸ **createProposalTransactionMap**(): *function*

*Inherited from [SchemeBase](schemebase.md).[createProposalTransactionMap](schemebase.md#createproposaltransactionmap)*

*Defined in [src/schemes/base.ts:308](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L308)*

**Returns:** *function*

▸ (`receipt`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`receipt` | any |

___

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[ISchemeStaticState](../interfaces/ischemestaticstate.md)›*

*Overrides [SchemeBase](schemebase.md).[fetchStaticState](schemebase.md#fetchstaticstate)*

*Defined in [src/scheme.ts:216](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/scheme.ts#L216)*

fetch the static state from the subgraph

**Returns:** *Promise‹[ISchemeStaticState](../interfaces/ischemestaticstate.md)›*

the statatic state

___

###  proposals

▸ **proposals**(`options`: [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Proposal](proposal.md)[]›*

*Overrides [SchemeBase](schemebase.md).[proposals](schemebase.md#proposals)*

*Defined in [src/scheme.ts:326](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/scheme.ts#L326)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Proposal](proposal.md)[]›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [ISchemeStaticState](../interfaces/ischemestaticstate.md)): *void*

*Overrides [SchemeBase](schemebase.md).[setStaticState](schemebase.md#setstaticstate)*

*Defined in [src/scheme.ts:202](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/scheme.ts#L202)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [ISchemeStaticState](../interfaces/ischemestaticstate.md) |

**Returns:** *void*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[ISchemeState](../interfaces/ischemestate.md)›*

*Overrides [SchemeBase](schemebase.md).[state](schemebase.md#abstract-state)*

*Defined in [src/scheme.ts:237](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/scheme.ts#L237)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[ISchemeState](../interfaces/ischemestate.md)›*

___

### `Static` itemMap

▸ **itemMap**(`item`: any, `arc`: [Arc](arc.md)): *[ISchemeState](../interfaces/ischemestate.md) | null*

*Defined in [src/scheme.ts:107](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/scheme.ts#L107)*

map an apollo query result to ISchemeState

**`static`** 

**`memberof`** Scheme

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`arc` | [Arc](arc.md) |

**Returns:** *[ISchemeState](../interfaces/ischemestate.md) | null*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: [ISchemeQueryOptions](../interfaces/ischemequeryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹Array‹[Scheme](scheme.md) | [CompetitionScheme](competitionscheme.md)››*

*Defined in [src/scheme.ts:35](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/scheme.ts#L35)*

Scheme.search(context, options) searches for scheme entities

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | an Arc instance that provides connection information |
`options` | [ISchemeQueryOptions](../interfaces/ischemequeryoptions.md) |  {} | the query options, cf. ISchemeQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹Array‹[Scheme](scheme.md) | [CompetitionScheme](competitionscheme.md)››*

an observable of Scheme objects

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
