[@daostack/client](../README.md) › [Globals](../globals.md) › [SchemeBase](schemebase.md)

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
* [x](schemebase.md#x)

### Object literals

* [fragments](schemebase.md#static-fragments)

## Constructors

###  constructor

\+ **new SchemeBase**(`idOrOpts`: [Address](../globals.md#address) | [ISchemeStaticState](../interfaces/ischemestaticstate.md), `context`: [Arc](arc.md)): *[SchemeBase](schemebase.md)*

*Defined in [schemes/base.ts:239](https://github.com/daostack/client/blob/7361fcc/src/schemes/base.ts#L239)*

**Parameters:**

Name | Type |
------ | ------ |
`idOrOpts` | [Address](../globals.md#address) &#124; [ISchemeStaticState](../interfaces/ischemestaticstate.md) |
`context` | [Arc](arc.md) |

**Returns:** *[SchemeBase](schemebase.md)*

## Properties

###  ReputationFromToken

• **ReputationFromToken**: *[ReputationFromTokenScheme](reputationfromtokenscheme.md) | null* =  null

*Defined in [schemes/base.ts:239](https://github.com/daostack/client/blob/7361fcc/src/schemes/base.ts#L239)*

___

###  context

• **context**: *[Arc](arc.md)*

*Defined in [schemes/base.ts:241](https://github.com/daostack/client/blob/7361fcc/src/schemes/base.ts#L241)*

___

###  id

• **id**: *[Address](../globals.md#address)*

*Defined in [schemes/base.ts:237](https://github.com/daostack/client/blob/7361fcc/src/schemes/base.ts#L237)*

___

###  staticState

• **staticState**: *[ISchemeStaticState](../interfaces/ischemestaticstate.md) | null* =  null

*Defined in [schemes/base.ts:238](https://github.com/daostack/client/blob/7361fcc/src/schemes/base.ts#L238)*

## Methods

###  createProposal

▸ **createProposal**(`options`: [IProposalCreateOptions](../globals.md#iproposalcreateoptions)): *[Operation](../globals.md#operation)‹[Proposal](proposal.md)›*

*Defined in [schemes/base.ts:300](https://github.com/daostack/client/blob/7361fcc/src/schemes/base.ts#L300)*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [IProposalCreateOptions](../globals.md#iproposalcreateoptions) |

**Returns:** *[Operation](../globals.md#operation)‹[Proposal](proposal.md)›*

___

###  createProposalErrorHandler

▸ **createProposalErrorHandler**(`options?`: any): *function*

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

*Defined in [schemes/base.ts:256](https://github.com/daostack/client/blob/7361fcc/src/schemes/base.ts#L256)*

fetch the static state from the subgraph

**Returns:** *Promise‹[ISchemeStaticState](../interfaces/ischemestaticstate.md)›*

the statatic state

___

###  proposals

▸ **proposals**(`options`: [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md), `apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[Proposal](proposal.md)[]›*

*Defined in [schemes/base.ts:467](https://github.com/daostack/client/blob/7361fcc/src/schemes/base.ts#L467)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`options` | [IProposalQueryOptions](../interfaces/iproposalqueryoptions.md) |  {} |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |  {} |

**Returns:** *Observable‹[Proposal](proposal.md)[]›*

___

###  setStaticState

▸ **setStaticState**(`opts`: [ISchemeStaticState](../interfaces/ischemestaticstate.md)): *void*

*Defined in [schemes/base.ts:279](https://github.com/daostack/client/blob/7361fcc/src/schemes/base.ts#L279)*

**Parameters:**

Name | Type |
------ | ------ |
`opts` | [ISchemeStaticState](../interfaces/ischemestaticstate.md) |

**Returns:** *void*

___

### `Abstract` state

▸ **state**(`apolloQueryOptions`: [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md)): *Observable‹[ISchemeState](../interfaces/ischemestate.md)›*

*Defined in [schemes/base.ts:317](https://github.com/daostack/client/blob/7361fcc/src/schemes/base.ts#L317)*

**Parameters:**

Name | Type |
------ | ------ |
`apolloQueryOptions` | [IApolloQueryOptions](../interfaces/iapolloqueryoptions.md) |

**Returns:** *Observable‹[ISchemeState](../interfaces/ischemestate.md)›*

___

###  x

▸ **x**(): *void*

*Defined in [schemes/base.ts:319](https://github.com/daostack/client/blob/7361fcc/src/schemes/base.ts#L319)*

**Returns:** *void*

## Object literals

### `Static` fragments

### ▪ **fragments**: *object*

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
