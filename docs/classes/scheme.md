[@daostack/client](../README.md) › [Globals](../globals.md) › [Scheme](scheme.md)

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
* [x](scheme.md#x)
* [itemMap](scheme.md#static-itemmap)
* [search](scheme.md#static-search)

### Object literals

* [fragments](scheme.md#static-fragments)

## Constructors

###  constructor

\+ **new Scheme**(`idOrOpts`: [Address](../globals.md#address) | ISchemeStaticState, `context`: [Arc](arc.md)): *[Scheme](scheme.md)*

*Overrides [SchemeBase](schemebase.md).[constructor](schemebase.md#constructor)*

*Defined in [scheme.ts:259](https://github.com/daostack/client/blob/7361fcc/src/scheme.ts#L259)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | [Address](../globals.md#address) &#124; ISchemeStaticState |
`context` | [Arc](arc.md) |

**Returns:** *[Scheme](scheme.md)*

## Properties

###  ReputationFromToken

• **ReputationFromToken**: *[ReputationFromTokenScheme](reputationfromtokenscheme.md) | null* =  null

*Overrides [SchemeBase](schemebase.md).[ReputationFromToken](schemebase.md#reputationfromtoken)*

*Defined in [scheme.ts:259](https://github.com/daostack/client/blob/7361fcc/src/scheme.ts#L259)*

___

###  context

• **context**: *[Arc](arc.md)*

*Overrides [SchemeBase](schemebase.md).[context](schemebase.md#context)*

*Defined in [scheme.ts:261](https://github.com/daostack/client/blob/7361fcc/src/scheme.ts#L261)*

___

###  id

• **id**: *[Address](../globals.md#address)*

*Overrides [SchemeBase](schemebase.md).[id](schemebase.md#id)*

*Defined in [scheme.ts:257](https://github.com/daostack/client/blob/7361fcc/src/scheme.ts#L257)*

___

###  staticState

• **staticState**: *ISchemeStaticState | null* =  null

*Overrides [SchemeBase](schemebase.md).[staticState](schemebase.md#staticstate)*

*Defined in [scheme.ts:258](https://github.com/daostack/client/blob/7361fcc/src/scheme.ts#L258)*

## Methods

###  createProposal

▸ **createProposal**(`options`: [IProposalCreateOptions](../globals.md#iproposalcreateoptions)): *[Operation](../globals.md#operation)‹[Proposal](proposal.md)›*

*Overrides [SchemeBase](schemebase.md).[createProposal](schemebase.md#createproposal)*

*Defined in [scheme.ts:295](https://github.com/daostack/client/blob/7361fcc/src/scheme.ts#L295)*

create a new proposal in this Scheme

**Parameters:**

Name | Type |
------ | ------ |
`options` | [IProposalCreateOptions](../globals.md#iproposalcreateoptions) |

**Returns:** *[Operation](../globals.md#operation)‹[Proposal](proposal.md)›*

a Proposal instance

___

###  createProposalErrorHandler

▸ **createProposalErrorHandler**(`options?`: any): *function*

*Inherited from [SchemeBase](schemebase.md).[createProposalErrorHandler](schemebase.md#createproposalerrorhandler)*

*Defined in [schemes/base.ts:296](https://github.com/daostack/client/blob/7361fcc/src/schemes/base.ts#L296)*

**Parameters:**

Name | Type |
------ | ------ |
`options?` | any |

**Returns:** *function*

▸ (`err`: Error): *Error | Promise‹Error›*

**Parameters:**

Name | Type |
------ | ------ |
`err` | Error |

___

###  createProposalTransaction

▸ **createProposalTransaction**(`options`: any): *function*

*Inherited from [SchemeBase](schemebase.md).[createProposalTransaction](schemebase.md#createproposaltransaction)*

*Defined in [schemes/base.ts:288](https://github.com/daostack/client/blob/7361fcc/src/schemes/base.ts#L288)*

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

*Defined in [schemes/base.ts:292](https://github.com/daostack/client/blob/7361fcc/src/schemes/base.ts#L292)*

**Returns:** *function*

▸ (`receipt`: any): *any*

**Parameters:**

Name | Type |
------ | ------ |
`receipt` | any |

___

###  fetchStaticState

▸ **fetchStaticState**(): *Promise‹[ISchemeStaticState](../interfaces/ischemestaticstate.md)›*

*Inherited from [SchemeBase](schemebase.md).[fetchStaticState](schemebase.md#fetchstaticstate)*

*Defined in [schemes/base.ts:256](https://github.com/daostack/client/blob/7361fcc/src/schemes/base.ts#L256)*

fetch the static state from the subgraph

**Returns:** *Promise‹[ISchemeStaticState](../interfaces/ischemestaticstate.md)›*

the statatic state

___

###  proposals

▸ **proposals**(`options`: [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Proposal](proposal.md)[]›*

*Overrides [SchemeBase](schemebase.md).[proposals](schemebase.md#proposals)*

*Defined in [scheme.ts:363](https://github.com/daostack/client/blob/7361fcc/src/scheme.ts#L363)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Proposal](proposal.md)[]›*

___

###  setStaticState

▸ **setStaticState**(`opts`: ISchemeStaticState): *void*

*Overrides [SchemeBase](schemebase.md).[setStaticState](schemebase.md#setstaticstate)*

*Defined in [scheme.ts:273](https://github.com/daostack/client/blob/7361fcc/src/scheme.ts#L273)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | ISchemeStaticState |

**Returns:** *void*

___

###  state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹ISchemeState›*

*Overrides [SchemeBase](schemebase.md).[state](schemebase.md#abstract-state)*

*Defined in [scheme.ts:277](https://github.com/daostack/client/blob/7361fcc/src/scheme.ts#L277)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹ISchemeState›*

___

###  x

▸ **x**(): *void*

*Inherited from [SchemeBase](schemebase.md).[x](schemebase.md#x)*

*Defined in [schemes/base.ts:319](https://github.com/daostack/client/blob/7361fcc/src/schemes/base.ts#L319)*

**Returns:** *void*

___

### `Static` itemMap

▸ **itemMap**(`item`: any, `arc`: [Arc](arc.md)): *ISchemeState | null*

*Defined in [scheme.ts:188](https://github.com/daostack/client/blob/7361fcc/src/scheme.ts#L188)*

map an apollo query result to ISchemeState

**`static`** 

**`memberof`** Scheme

**Parameters:**

Name | Type |
------ | ------ |
`item` | any |
`arc` | [Arc](arc.md) |

**Returns:** *ISchemeState | null*

___

### `Static` search

▸ **search**(`context`: [Arc](arc.md), `options`: ISchemeQueryOptions, `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹Array‹[Scheme](scheme.md) | [CompetitionScheme](competitionscheme.md)››*

*Defined in [scheme.ts:116](https://github.com/daostack/client/blob/7361fcc/src/scheme.ts#L116)*

Scheme.search(context, options) searches for scheme entities

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`context` | [Arc](arc.md) | - | an Arc instance that provides connection information |
`options` | ISchemeQueryOptions |  {} | the query options, cf. ISchemeQueryOptions |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} | - |

**Returns:** *Observable‹Array‹[Scheme](scheme.md) | [CompetitionScheme](competitionscheme.md)››*

an observable of Scheme objects

## Object literals

### `Static` fragments

### ▪ **fragments**: *object*

*Inherited from [SchemeBase](schemebase.md).[fragments](schemebase.md#static-fragments)*

*Defined in [schemes/base.ts:106](https://github.com/daostack/client/blob/7361fcc/src/schemes/base.ts#L106)*

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

*Defined in [schemes/base.ts:107](https://github.com/daostack/client/blob/7361fcc/src/schemes/base.ts#L107)*
