[@daostack/arc.js - v0.2.87](../README.md) › [Globals](../globals.md) › [SchemeBase](schemebase.md)

# Class: SchemeBase

A Scheme represents a scheme instance that is registered at a DAO

## Hierarchy

* **SchemeBase**

  ↳ [CompetitionScheme](competitionscheme.md)

  ↳ [Scheme](scheme.md)

## Implements

* [IStateful](../interfaces/istateful.md)‹[ISchemeState](../interfaces/ischemestate.md)›

## Index

### Constructors

* [constructor](schemebase.md#constructor)

### Properties

* [CTL4R](schemebase.md#ctl4r)
* [ReputationFromToken](schemebase.md#reputationfromtoken)
* [context](schemebase.md#context)
* [id](schemebase.md#id)
* [staticState](schemebase.md#staticstate)

### Methods

* [createProposal](schemebase.md#createproposal)
* [createProposalErrorHandler](schemebase.md#createproposalerrorhandler)
* [createProposalTransaction](schemebase.md#createproposaltransaction)
* [createProposalTransactionMap](schemebase.md#createproposaltransactionmap)
* [fetchStaticState](schemebase.md#fetchstaticstate)
* [proposals](schemebase.md#proposals)
* [setStaticState](schemebase.md#setstaticstate)
* [state](schemebase.md#abstract-state)

### Object literals

* [fragments](schemebase.md#static-fragments)

## Constructors

###  constructor

\+ **new SchemeBase**(`idOrOpts`: [Address](../globals.md#address) | [ISchemeStaticState](../interfaces/ischemestaticstate.md), `context`: [Arc](arc.md)): *[SchemeBase](schemebase.md)*

*Defined in [src/schemes/base.ts:252](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L252)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | [Address](../globals.md#address) &#124; [ISchemeStaticState](../interfaces/ischemestaticstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[SchemeBase](schemebase.md)*

## Properties

###  CTL4R

• **CTL4R**: *[CL4RScheme](cl4rscheme.md) | null* =  null

*Defined in [src/schemes/base.ts:252](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L252)*

___

###  ReputationFromToken

• **ReputationFromToken**: *[ReputationFromTokenScheme](reputationfromtokenscheme.md) | null* =  null

*Defined in [src/schemes/base.ts:251](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L251)*

___

###  context

• **context**: *[Arc](arc.md)*

*Defined in [src/schemes/base.ts:254](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L254)*

___

###  id

• **id**: *[Address](../globals.md#address)*

*Defined in [src/schemes/base.ts:249](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L249)*

___

###  staticState

• **staticState**: *[ISchemeStaticState](../interfaces/ischemestaticstate.md) | null* =  null

*Defined in [src/schemes/base.ts:250](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L250)*

## Methods

###  createProposal

▸ **createProposal**(`options`: [IProposalCreateOptions](../globals.md#iproposalcreateoptions)): *[Operation](../globals.md#operation)‹[Proposal](proposal.md)›*

*Defined in [src/schemes/base.ts:317](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L317)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [IProposalCreateOptions](../globals.md#iproposalcreateoptions) |

**Returns:** *[Operation](../globals.md#operation)‹[Proposal](proposal.md)›*

___

###  createProposalErrorHandler

▸ **createProposalErrorHandler**(`options?`: any): *function | undefined*

*Defined in [src/schemes/base.ts:312](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L312)*

**Parameters:**

Name | Type |
------ | ------ |
`options?` | any |

**Returns:** *function | undefined*

___

###  createProposalTransaction

▸ **createProposalTransaction**(`options`: any): *function*

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

*Defined in [src/schemes/base.ts:269](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L269)*

fetch the static state from the subgraph

**Returns:** *Promise‹[ISchemeStaticState](../interfaces/ischemestaticstate.md)›*

the statatic state

___

###  proposals

▸ **proposals**(`options`: [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Proposal](proposal.md)[]›*

*Defined in [src/schemes/base.ts:336](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L336)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Proposal](proposal.md)[]›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [ISchemeStaticState](../interfaces/ischemestaticstate.md)): *void*

*Defined in [src/schemes/base.ts:295](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L295)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [ISchemeStaticState](../interfaces/ischemestaticstate.md) |

**Returns:** *void*

___

### `Abstract` state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[ISchemeState](../interfaces/ischemestate.md)›*

*Defined in [src/schemes/base.ts:334](https://github.com/daostack/alchemy-monorepo/blob/6a18bc5/packages/arc.js/src/schemes/base.ts#L334)*

**Parameters:**

Name | Type |
------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |

**Returns:** *Observable‹[ISchemeState](../interfaces/ischemestate.md)›*

## Object literals

### `Static` fragments

### ▪ **fragments**: *object*

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
